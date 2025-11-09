const { ethers } = require('ethers');

// 配置
const RPC_URL = process.env.BERACHAIN_RPC || 'https://rpc.berachain.com';
const NFT_MINING_POOL = '0x0D9bfaC27128EA2754179400eB932F13B7c52097';
const T_ENGINE_POOL = '0xd9661D56659B80A875E42A51955434A0818581D8';
const DP_TOKEN = '0xf7C464c7832e59855aa245Ecc7677f54B3460e7d';

// 过滤地址列表（不显示这些地址的记录）
const HIDDEN_ADDRESSES = [
  '0xd8b4286c2f299220830f7228bab15225b4ea8379' // T-Engine 税费接收地址
];

// DP Token Transfer 事件签名
const TRANSFER_EVENT_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

// 缓存配置
let cache = {
  nftClaims: { data: null, timestamp: 0 },
  tEngineDeposits: { data: null, timestamp: 0 },
  tEngineClaims: { data: null, timestamp: 0 }
};
const CACHE_TTL = 60000; // 1 分钟缓存

// 初始化 provider
let provider;
function getProvider() {
  if (!provider) {
    provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  }
  return provider;
}

// 格式化地址（checksummed）
function formatAddress(addr) {
  try {
    return ethers.utils.getAddress(addr);
  } catch {
    return addr;
  }
}

// 格式化 DP 数量
function formatDP(value) {
  return parseFloat(ethers.utils.formatEther(value)).toFixed(2);
}

/**
 * 获取 NFT 矿池的 DP claim 记录
 * 通过查询 Transfer(from=nftMiningPool, to=user) 事件
 */
async function getNFTPoolClaims(fromBlock = null, toBlock = 'latest', limit = 100) {
  const now = Date.now();
  if (cache.nftClaims.data && (now - cache.nftClaims.timestamp) < CACHE_TTL) {
    console.log('📦 使用缓存的 NFT claims');
    return cache.nftClaims.data;
  }

  try {
    const provider = getProvider();
    
    // 获取当前区块
    const latestBlock = await provider.getBlockNumber();
    console.log('📍 当前区块:', latestBlock);
    
    // 如果未指定起始区块，默认查询最近 9900 个区块（约5.5小时，RPC限制 10000）
    if (!fromBlock) {
      fromBlock = Math.max(0, latestBlock - 9900);
    }
    
    console.log('📊 查询区块范围:', fromBlock, 'to', toBlock, `(共 ${latestBlock - fromBlock} 个区块)`);
    
    // 查询 Transfer 事件：from = NFT_MINING_POOL
    const filter = {
      address: DP_TOKEN,
      topics: [
        TRANSFER_EVENT_TOPIC,
        ethers.utils.hexZeroPad(NFT_MINING_POOL.toLowerCase(), 32) // from
        // to 不限制，匹配所有
      ],
      fromBlock,
      toBlock
    };

    console.log('🔍 查询 NFT 池 Transfer 事件...', { fromBlock, toBlock });
    const logs = await provider.getLogs(filter);
    console.log(`✅ 找到 ${logs.length} 条 NFT claim 记录`);

    // 解析事件
    const iface = new ethers.utils.Interface([
      'event Transfer(address indexed from, address indexed to, uint256 value)'
    ]);

    const records = [];
    for (const log of logs) {
      try {
        const parsed = iface.parseLog(log);
        const block = await provider.getBlock(log.blockNumber);
        
        records.push({
          txHash: log.transactionHash,
          blockNumber: log.blockNumber,
          timestamp: block.timestamp,
          from: formatAddress(parsed.args.from),
          to: formatAddress(parsed.args.to),
          amount: formatDP(parsed.args.value),
          amountRaw: parsed.args.value.toString(),
          type: 'claim'
        });
      } catch (parseErr) {
        console.warn('⚠️ 解析日志失败:', parseErr);
      }
    }

    // 按时间倒序排序
    records.sort((a, b) => b.timestamp - a.timestamp);

    // 限制数量
    const result = records.slice(0, limit);
    
    // 缓存
    cache.nftClaims = { data: result, timestamp: now };
    
    return result;
  } catch (error) {
    console.error('❌ 获取 NFT claims 失败:', error);
    throw error;
  }
}

/**
 * 获取 T-Engine 的投入记录
 * T-Engine deposit 是通过 burn DP Token 实现的，所以查询 Transfer(from=user, to=0x0) 事件
 * 同时查询 T-Engine 合约的 Deposited 事件来确认是 deposit 而不是其他 burn
 */
async function getTEngineDeposits(fromBlock = null, toBlock = 'latest', limit = 100) {
  const now = Date.now();
  if (cache.tEngineDeposits.data && (now - cache.tEngineDeposits.timestamp) < CACHE_TTL) {
    console.log('📦 使用缓存的 T-Engine deposits');
    return cache.tEngineDeposits.data;
  }

  try {
    const provider = getProvider();
    
    // 获取当前区块
    const latestBlock = await provider.getBlockNumber();
    console.log('📍 当前区块:', latestBlock);
    
    // 如果未指定起始区块，默认查询最近 9900 个区块（约5.5小时）
    if (!fromBlock) {
      fromBlock = Math.max(0, latestBlock - 9900);
    }
    
    console.log('📊 查询区块范围:', fromBlock, 'to', toBlock, `(共 ${latestBlock - fromBlock} 个区块)`);
    
    // 方案：查询 DP Token burn 事件 (Transfer to 0x0)
    const filter = {
      address: DP_TOKEN,
      topics: [
        TRANSFER_EVENT_TOPIC,
        null, // from 不限制
        ethers.utils.hexZeroPad(ethers.constants.AddressZero, 32) // to = 0x0 (burn)
      ],
      fromBlock,
      toBlock
    };

    console.log('🔍 查询 DP Token burn 事件 (T-Engine deposit)...', { fromBlock, toBlock });
    const logs = await provider.getLogs(filter);
    console.log(`✅ 找到 ${logs.length} 条 burn 记录`);

    const iface = new ethers.utils.Interface([
      'event Transfer(address indexed from, address indexed to, uint256 value)'
    ]);

    const records = [];
    for (const log of logs) {
      try {
        const parsed = iface.parseLog(log);
        const block = await provider.getBlock(log.blockNumber);
        
        const from = formatAddress(parsed.args.from);
        
        // 过滤掉零地址作为 from 的情况（不可能发生）
        if (from === ethers.constants.AddressZero) continue;
        
        records.push({
          txHash: log.transactionHash,
          blockNumber: log.blockNumber,
          timestamp: block.timestamp,
          from: from,
          to: 'T-Engine (销毁)',
          amount: formatDP(parsed.args.value),
          amountRaw: parsed.args.value.toString(),
          type: 'deposit'
        });
      } catch (parseErr) {
        console.warn('⚠️ 解析日志失败:', parseErr);
      }
    }

    records.sort((a, b) => b.timestamp - a.timestamp);
    const result = records.slice(0, limit);
    
    cache.tEngineDeposits = { data: result, timestamp: now };
    
    return result;
  } catch (error) {
    console.error('❌ 获取 T-Engine deposits 失败:', error);
    throw error;
  }
}

/**
 * 获取 T-Engine 的 claim 记录
 * 通过查询 Transfer(from=tEngine, to=user) 事件
 */
async function getTEngineClaims(fromBlock = null, toBlock = 'latest', limit = 100) {
  const now = Date.now();
  if (cache.tEngineClaims.data && (now - cache.tEngineClaims.timestamp) < CACHE_TTL) {
    console.log('📦 使用缓存的 T-Engine claims');
    return cache.tEngineClaims.data;
  }

  try {
    const provider = getProvider();
    
    // 获取当前区块
    const latestBlock = await provider.getBlockNumber();
    console.log('📍 当前区块:', latestBlock);
    
    // 如果未指定起始区块，默认查询最近 9900 个区块（约5.5小时）
    if (!fromBlock) {
      fromBlock = Math.max(0, latestBlock - 9900);
    }
    
    console.log('📊 查询区块范围:', fromBlock, 'to', toBlock, `(共 ${latestBlock - fromBlock} 个区块)`);
    
    // 查询 Transfer 事件：from = T_ENGINE_POOL
    const filter = {
      address: DP_TOKEN,
      topics: [
        TRANSFER_EVENT_TOPIC,
        ethers.utils.hexZeroPad(T_ENGINE_POOL.toLowerCase(), 32) // from
        // to 不限制
      ],
      fromBlock,
      toBlock
    };

    console.log('🔍 查询 T-Engine claim Transfer 事件...', { fromBlock, toBlock });
    const logs = await provider.getLogs(filter);
    console.log(`✅ 找到 ${logs.length} 条 T-Engine claim 记录`);

    const iface = new ethers.utils.Interface([
      'event Transfer(address indexed from, address indexed to, uint256 value)'
    ]);

    const records = [];
    for (const log of logs) {
      try {
        const parsed = iface.parseLog(log);
        const block = await provider.getBlock(log.blockNumber);
        
        const toAddress = formatAddress(parsed.args.to);
        
        // 过滤隐藏地址
        if (HIDDEN_ADDRESSES.some(addr => addr.toLowerCase() === toAddress.toLowerCase())) {
          continue;
        }
        
        records.push({
          txHash: log.transactionHash,
          blockNumber: log.blockNumber,
          timestamp: block.timestamp,
          from: formatAddress(parsed.args.from),
          to: toAddress,
          amount: formatDP(parsed.args.value),
          amountRaw: parsed.args.value.toString(),
          type: 'claim'
        });
      } catch (parseErr) {
        console.warn('⚠️ 解析日志失败:', parseErr);
      }
    }

    records.sort((a, b) => b.timestamp - a.timestamp);
    const result = records.slice(0, limit);
    
    cache.tEngineClaims = { data: result, timestamp: now };
    
    return result;
  } catch (error) {
    console.error('❌ 获取 T-Engine claims 失败:', error);
    throw error;
  }
}

/**
 * API Handler
 */
module.exports = async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const type = url.searchParams.get('type'); // nft-claims | tengine-deposits | tengine-claims
  const fromBlockParam = url.searchParams.get('fromBlock');
  const fromBlock = fromBlockParam ? parseInt(fromBlockParam, 10) : null; // null = 自动计算
  const toBlock = url.searchParams.get('toBlock') || 'latest';
  const limit = parseInt(url.searchParams.get('limit') || '100', 10);

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, max-age=30');

  try {
    let data;
    
    switch (type) {
      case 'nft-claims':
        data = await getNFTPoolClaims(fromBlock, toBlock, limit);
        break;
      case 'tengine-deposits':
        data = await getTEngineDeposits(fromBlock, toBlock, limit);
        break;
      case 'tengine-claims':
        data = await getTEngineClaims(fromBlock, toBlock, limit);
        break;
      default:
        res.status(400);
        return res.json({ error: 'Invalid type parameter. Use: nft-claims | tengine-deposits | tengine-claims' });
    }

    res.status(200);
    res.json({
      success: true,
      type,
      count: data.length,
      data
    });
  } catch (error) {
    console.error('❌ API 错误:', error);
    res.status(500);
    res.json({
      success: false,
      error: error.message
    });
  }
};
