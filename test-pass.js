const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.berachain.com';
const DEBEAR_PASS = '0x29f2a6756E5B79C36Eb6699220CB56f7749C7514';
const HOLDER_ADDRESS = '0xd8b4286c2f299220830f7228bab15225b4ea8379';

const DEBEARPASS_ABI = [
  'function paused() view returns (bool)',
  'function passConfigs(uint256) view returns (uint256 maxSupply, uint256 totalMinted, uint256 multiplier, uint256 inviteRate)',
  'function getRemainingSupply(uint256) view returns (uint256)',
  'function version() view returns (string)',
  'function owner() view returns (address)',
  'function balanceOf(address owner, uint256 id) view returns (uint256)'
];

async function test() {
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const debearPass = new ethers.Contract(DEBEAR_PASS, DEBEARPASS_ABI, provider);
  
  console.log('🔍 查询 DebearPass 合约信息\n');
  
  try {
    const version = await debearPass.version();
    console.log('✅ 版本:', version);
  } catch (e) {
    console.log('❌ version() 不存在:', e.message);
  }
  
  try {
    const paused = await debearPass.paused();
    console.log('✅ 暂停状态:', paused);
  } catch (e) {
    console.log('❌ paused() 不存在:', e.message);
  }
  
  console.log('\n📊 查询 Pass 配置:\n');
  
  for (let passType = 1; passType <= 3; passType++) {
    try {
      const config = await debearPass.passConfigs(passType);
      console.log(`Pass Type ${passType}:`, {
        maxSupply: config.maxSupply.toString(),
        totalMinted: config.totalMinted.toString(),
        multiplier: config.multiplier.toString(),
        inviteRate: config.inviteRate.toString(),
        remaining: config.maxSupply.sub(config.totalMinted).toString()
      });
    } catch (e) {
      console.log(`❌ passConfigs(${passType}) 失败:`, e.message);
    }
  }
  
  console.log('\n💰 查询特定地址的 Pass 余额:\n');
  
  for (let passType = 1; passType <= 3; passType++) {
    try {
      const balance = await debearPass.balanceOf(HOLDER_ADDRESS, passType);
      const passName = passType === 1 ? 'Standard' : passType === 2 ? 'Premium' : 'Exclusive';
      console.log(`${passName} Pass (ID ${passType}):`, balance.toString());
    } catch (e) {
      console.log(`❌ balanceOf(${HOLDER_ADDRESS}, ${passType}) 失败:`, e.message);
    }
  }
}

test().catch(console.error);
