const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.berachain.com';
const T_ENGINE_POOL = '0xd9661D56659B80A875E42A51955434A0818581D8';
const DP_TOKEN = '0xf7C464c7832e59855aa245Ecc7677f54B3460e7d';
const TEST_USER = '0x782726e0234b2503f20d6074d1def4da39b85e6e';

const TRANSFER_EVENT_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

async function test() {
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  
  const latestBlock = await provider.getBlockNumber();
  console.log('📍 当前区块:', latestBlock);
  
  const fromBlock = latestBlock - 1000; // 最近 1000 个区块
  
  console.log('\n🔍 测试 1: 查询该用户作为 from 的所有 DP Transfer');
  const filter1 = {
    address: DP_TOKEN,
    topics: [
      TRANSFER_EVENT_TOPIC,
      ethers.utils.hexZeroPad(TEST_USER.toLowerCase(), 32) // from = 用户
    ],
    fromBlock,
    toBlock: 'latest'
  };
  
  const logs1 = await provider.getLogs(filter1);
  console.log(`✅ 找到 ${logs1.length} 条记录`);
  
  const iface = new ethers.utils.Interface([
    'event Transfer(address indexed from, address indexed to, uint256 value)'
  ]);
  
  for (const log of logs1) {
    const parsed = iface.parseLog(log);
    const block = await provider.getBlock(log.blockNumber);
    console.log({
      blockNumber: log.blockNumber,
      time: new Date(block.timestamp * 1000).toLocaleString(),
      from: parsed.args.from,
      to: parsed.args.to,
      amount: ethers.utils.formatEther(parsed.args.value),
      txHash: log.transactionHash
    });
  }
  
  console.log('\n🔍 测试 2: 查询转入 T-Engine 的所有 Transfer (不限 from)');
  const filter2 = {
    address: DP_TOKEN,
    topics: [
      TRANSFER_EVENT_TOPIC,
      null, // from 不限
      ethers.utils.hexZeroPad(T_ENGINE_POOL.toLowerCase(), 32) // to = T-Engine
    ],
    fromBlock,
    toBlock: 'latest'
  };
  
  const logs2 = await provider.getLogs(filter2);
  console.log(`✅ 找到 ${logs2.length} 条记录`);
  
  for (const log of logs2) {
    const parsed = iface.parseLog(log);
    const block = await provider.getBlock(log.blockNumber);
    console.log({
      blockNumber: log.blockNumber,
      time: new Date(block.timestamp * 1000).toLocaleString(),
      from: parsed.args.from,
      to: parsed.args.to,
      amount: ethers.utils.formatEther(parsed.args.value),
      txHash: log.transactionHash
    });
  }
  
  console.log('\n🔍 测试 3: 查询 T-Engine 合约的 Deposited 事件');
  const depositedTopic = ethers.utils.id('Deposited(address,uint256,uint256)');
  const filter3 = {
    address: T_ENGINE_POOL,
    topics: [depositedTopic],
    fromBlock,
    toBlock: 'latest'
  };
  
  try {
    const logs3 = await provider.getLogs(filter3);
    console.log(`✅ 找到 ${logs3.length} 条 Deposited 事件`);
    
    const depositIface = new ethers.utils.Interface([
      'event Deposited(address indexed user, uint256 amount, uint256 shares)'
    ]);
    
    for (const log of logs3) {
      const parsed = depositIface.parseLog(log);
      const block = await provider.getBlock(log.blockNumber);
      console.log({
        blockNumber: log.blockNumber,
        time: new Date(block.timestamp * 1000).toLocaleString(),
        user: parsed.args.user,
        amount: ethers.utils.formatEther(parsed.args.amount),
        shares: parsed.args.shares.toString(),
        txHash: log.transactionHash
      });
    }
  } catch (e) {
    console.log('❌ Deposited 事件查询失败:', e.message);
  }
}

test().catch(console.error);
