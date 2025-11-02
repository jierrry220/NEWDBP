/**
 * Debear Party - 国际化配置文件
 * 支持英文 (en) 和繁体中文 (zh-TW)
 */

const translations = {
    en: {
        // 导航栏
        'nav.home': 'Home',
        'nav.swap': 'Swap',
        'nav.pass': 'Pass NFT',
        'nav.tengine': 'T-Engine',
        'nav.gamefi': 'GameFi',
        'nav.connect': 'Connect Wallet',
        
        // Hero 区域
        'hero.badge': '🚀 Built on Berachain',
        'hero.title': 'Debear Party',
        'hero.subtitle': 'Next-Generation Web3 Trendy Metaverse Gaming Platform',
        'hero.description': 'Innovative Web3.0 Comprehensive Platform - DeFi, GameFi, and Trendy Collectibles Await Your Discovery',
        'hero.learnmore': 'Learn More',
        
        // 功能展示
        'features.title': 'Core Features',
        'features.subtitle': 'One-Stop Web3 Gaming Ecosystem',
        
        'feature.pass.title': 'NFT Pass System',
        'feature.pass.desc': 'Purchase Standard, Premium, or Exclusive Pass to enjoy different levels of mining power bonuses and exclusive benefits.',
        
        'feature.tengine.title': 'T-Engine Transformation',
        'feature.tengine.desc': 'Revolutionary T-Engine mechanism: Permanently burn DP tokens to get 4x mining shares, driving value growth through strong deflation.',
        
        'feature.invite.title': 'Referral Rewards',
        'feature.invite.desc': 'Holding Pass unlocks referral benefits. Share with friends to build the Debear Party community together.',
        
        'feature.dao.title': 'DAO Governance & RWA Assets',
        'feature.dao.desc': 'Pass holders enjoy DAO governance voting rights, and will receive platform fee dividends, RWA asset income distribution, and GameFi privileges.',
        
        'feature.security.title': 'Secure & Reliable',
        'feature.security.desc': 'Deployed on Berachain mainnet with audited smart contracts, ensuring asset security.',
        
        'feature.gamefi.title': 'GameFi & Trendy Metaverse',
        'feature.gamefi.desc': 'Upcoming social GameFi games combined with trendy RWA assets, creating a play-to-earn metaverse experience.',
        
        // Roadmap
        'roadmap.title': 'Roadmap',
        'roadmap.subtitle': 'Our Vision & Planning',
        
        'roadmap.phase1.title': 'Phase 1: Launch & Community Building (Q2-Q3 2025) ✅',
        'roadmap.phase1.desc': '• Pass Sales (Standard/Premium/Exclusive)<br>• DP Token Launch & Initial Liquidity Pool<br>• NFT Mining & T-Engine Features Launch<br>• Community Building & Incentive Activities',
        
        'roadmap.phase2.title': 'Phase 2: Ecosystem Expansion (Q4 2025 - Q1 2026)',
        'roadmap.phase2.desc': '• GameFi Social Game Launch<br>• DAO Governance System Activation<br>• RWA Trendy Asset Module Development<br>• Liquidity Staking & PoL Rewards',
        
        'roadmap.milestone.title': 'Milestone Goals',
        'roadmap.milestone.desc': '• Phase 1: 2,000 Passes Sold Out, 1000+ Community Members, TVL Reaches $5M<br>• Phase 2: TVL Climbs to $20M, 5000+ Monthly Active Users, RWA Assets Launch',
        
        'roadmap.vision.title': 'Future Vision',
        'roadmap.vision.desc': '• Become the Most Innovative Trendy Metaverse Platform on Berachain<br>• Connect Web3 Technology with Trendy Culture<br>• Build a Fair and Transparent Value Ecosystem',
        
        // Footer
        'footer.about.title': 'About Us',
        'footer.about.desc': 'Debear Party is an innovative Web3.0 comprehensive platform based on Berachain, featuring DeFi, GameFi, and RWA, committed to building a decentralized community ecosystem.',
        
        'footer.developer.title': 'Developer',
        'footer.developer.whitepaper': 'Whitepaper',
        'footer.developer.contract': 'Smart Contracts',
        'footer.developer.audit': 'Audit Report',
        'footer.developer.github': 'GitHub',
        'footer.developer.test': 'Debear Party Complete Test Page',
        
        'footer.community.title': 'Community',
        'footer.community.discord': 'Discord',
        'footer.community.twitter': 'Twitter',
        'footer.community.telegram': 'Telegram',
        'footer.community.medium': 'Medium',
        'footer.community.help': 'Help Center',
        
        'footer.copyright': '© 2025 Debear Party. All rights reserved. Built on Berachain.',
        
        // Toast 消息
        'toast.wallet.noProvider': 'Please install MetaMask or OKX Wallet!',
        'toast.wallet.switchNetwork': 'Please switch to Berachain Mainnet (Chain ID: 80094)',
        'toast.wallet.connecting': 'Connecting wallet...',
        'toast.wallet.connected': 'Wallet connected successfully!',
        'toast.wallet.failed': 'Failed to connect wallet',
        
        // Loading
        'loading.default': 'Loading...',
        'loading.connecting': 'Connecting wallet...',
        
        // 语言选择器
        'lang.en': 'English',
        'lang.zh': '繁體中文',
        
        // T-Engine 页面
        'tengine.title': 'T-Engine',
        'tengine.subtitle': 'T-Engine System - Continuously Earn DP Token Rewards',
        'tengine.nextRelease': 'Next Release',
        'tengine.pendingReward': 'Pending Rewards',
        'tengine.claimReward': 'Claim Reward',
        'tengine.totalStake': 'Total Network Stake:',
        'tengine.myRemaining': 'My Remaining Shares:',
        'tengine.myStake': 'My Stake:',
        'tengine.totalClaimed': 'Total Claimed:',
        'tengine.stakeAmount': 'Stake Amount (DP Token)',
        'tengine.balance': 'Balance:',
        'tengine.stake': 'Stake',
        'tengine.whatIs': '🚀 What is T-Engine?',
        'tengine.intro1': 'T-Engine is the core mining engine of the Debear Party ecosystem. By staking DP Tokens, users can start T-Engine for continuous mining and earn generous DP Token rewards.',
        'tengine.intro2': 'T-Engine releases 0.3% of remaining shares daily, ensuring fair distribution and sustainable development. Whether you stake small or large amounts, you can earn corresponding returns.',
        'tengine.howTo': '🔄 How to Use?',
        'tengine.step1': '<strong>Connect Wallet:</strong> Make sure you have enough DP Tokens in your wallet',
        'tengine.step2': '<strong>Stake Tokens:</strong> Enter stake amount and click "Stake" button',
        'tengine.step3': '<strong>Start Mining:</strong> After successful staking, T-Engine starts automatically',
        'tengine.step4': '<strong>Claim Rewards:</strong> You can claim 0.3% of remaining shares daily, with 10% tax on claims',
        'tengine.step5': '<strong>Continuous Earnings:</strong> Regularly claim rewards and reinvest for higher returns',
        'tengine.notice': '⚠️ Notice',
        'tengine.notice1': 'Staking requires a small amount of Gas fee (BERA)',
        'tengine.notice2': 'T-Engine does not support withdrawing stakes, only claiming daily released rewards',
        'tengine.notice3': 'Holding Pass NFT grants mining power bonus (Coming Soon)',
        'tengine.notice4': 'Smart contracts have been audited, but please invest cautiously',
        
        // T-Engine 邀请收益
        'tengine.inviteTitle': '🎁 My Referral Rewards',
        'tengine.inviteInfo': '💡 Invite users to stake and earn rewards: No Pass 3% | Standard Pass 8% | Premium Pass 11% | Exclusive Pass 15%',
        'tengine.passLevel': 'Pass Level:',
        'tengine.rewardRate': 'Current Reward Rate:',
        'tengine.acceleratedRelease': '💨 Accelerated Release:',
        'tengine.myReferrals': '👥 My Referrals:',
        
        // T-Engine 输入框
        'tengine.inputPlaceholder': 'Enter stake amount',
        'tengine.modalPlaceholder': '0x... (optional)',
        
        // T-Engine 消息提示
        'tengine.msg.noWallet': 'Please connect wallet first',
        'tengine.msg.invalidAmount': 'Please enter valid stake amount',
        'tengine.msg.approving': 'Step 1/2: Approving DP Token...',
        'tengine.msg.staking': 'Step 2/2: Executing stake...',
        'tengine.msg.stakeSuccess': 'Stake successful! T-Engine started',
        'tengine.msg.stakeFailed': 'Stake failed: ',
        'tengine.msg.claiming': 'Claiming rewards...',
        'tengine.msg.claimSuccess': 'Rewards claimed successfully!',
        'tengine.msg.claimFailed': 'Claim failed: ',
        'tengine.msg.noUnstake': 'T-Engine does not support withdrawing stakes, only claiming rewards',
        'tengine.msg.walletConnected': 'Wallet connected successfully!',
        'tengine.msg.walletFailed': 'Failed to connect wallet: ',
        'tengine.msg.invalidAddress': 'Please enter valid Ethereum address format',
        
        // Swap 页面
        'swap.title': '💱 Swap',
        'swap.swapTokens': 'Swap Tokens',
        'swap.settings': 'Settings',
        'swap.from': 'From',
        'swap.to': 'To',
        'swap.balance': 'Balance:',
        'swap.swapButton': 'Swap',
        'swap.selectToken': 'Select Token',
        'swap.customToken': '🔍 Enter Custom Token Address',
        'swap.addToken': 'Add Token',
        'swap.priceImpact': 'Price Impact:',
        'swap.slippage': 'Slippage:',
        
        // Pass NFT 页面
        'pass.title': '🎫 Pass NFT',
        'pass.subtitle': 'Purchase Exclusive Pass to Start Your Debear Party Journey',
        'pass.buyTab': 'Buy Pass NFT',
        'pass.miningTab': 'NFT Mining',
        'pass.buyNow': 'Buy Now',
        'pass.myCollection': '🎨 My Pass NFT Collection',
        'pass.initMining': 'Start NFT Mining',
        'pass.initDescription': 'You need to initialize the mining system first to start earning DP Token rewards',
        'pass.initialize': 'Initialize',
        'pass.nftMining': '🎨 NFT Pass Mining',
        'pass.autoMining': 'Holding Pass automatically mines, no staking needed! Daily output calculated automatically based on Pass level.',
        'pass.claimableReward': 'Claimable Reward',
        'pass.claimReward': 'Claim Reward',
        'pass.standardPass': 'Standard Pass:',
        'pass.premiumPass': 'Premium Pass:',
        'pass.exclusivePass': 'Exclusive Pass:',
        'pass.dailyOutput': 'Daily Output:',
        'pass.perDay': '/day',
        'pass.lastClaim': 'Last Claim:',
        'pass.inviteTitle': '🎁 Enter Referrer Address',
        'pass.inviteDesc': 'You are detected as a new user. Please enter referrer address to get rewards, or skip to use default referrer.',
        'pass.skip': 'Skip',
        'pass.confirm': 'Confirm',
        'pass.sendNFT': '📤 Send Pass NFT',
        'pass.passType': 'Pass Type:',
        'pass.available': 'Available:',
        'pass.recipientAddress': 'Enter recipient address (0x...)',
        'pass.sendAmount': 'Enter send amount',
        'pass.cancel': 'Cancel',
        'pass.send': 'Send',
        'pass.ownedAmount': 'Owned:',
        
        // GameFi 页面
        'gamefi.title': '🎮',
        'gamefi.developing': 'Game In Development',
        'gamefi.subtitle': 'We are building an exciting GameFi experience<br>Stay tuned!',
        'gamefi.competition': 'Competitive Battles',
        'gamefi.playToEarn': 'Play to Earn',
        'gamefi.nftEquipment': 'NFT Equipment',
        'gamefi.socialInteraction': 'Social Interaction',
        'gamefi.backHome': 'Back to Home',
        
        // Whitepaper 白皮书
        'whitepaper.backHome': '← Back to Home',
        'whitepaper.title': 'Debear Party Whitepaper',
        'whitepaper.subtitle': 'Trendy Metaverse Gaming Platform',
        'whitepaper.version': 'Version:',
        'whitepaper.releaseDate': 'Release Date:',
        'whitepaper.toc': '📋 Table of Contents',
    },
    
    'zh-TW': {
        // 導航欄
        'nav.home': '首頁',
        'nav.swap': 'Swap',
        'nav.pass': 'Pass NFT',
        'nav.tengine': 'T-Engine',
        'nav.gamefi': 'GameFi',
        'nav.connect': '連接錢包',
        
        // Hero 區域
        'hero.badge': '🚀 基於 Berachain',
        'hero.title': 'Debear Party',
        'hero.subtitle': '下一代 Web3 潮流元宇宙遊戲平台',
        'hero.description': '創新型Web3.0綜合平台 DeFi GameFi 潮流玩物待你發現',
        'hero.learnmore': '了解更多',
        
        // 功能展示
        'features.title': '核心功能',
        'features.subtitle': '一站式 Web3 遊戲生態系統',
        
        'feature.pass.title': 'NFT Pass 系統',
        'feature.pass.desc': '購買 Standard、Premium 或 Exclusive Pass，享受不同等級的挖礦算力加成和專屬權益。',
        
        'feature.tengine.title': 'T-Engine 嬗變引擎',
        'feature.tengine.desc': '革命性的T-Engine（嬗變引擎）機制：永久銷毀DP代幣獲得4倍挖礦份額，強力通縮推動價值增長。',
        
        'feature.invite.title': '邀請獎勵系統',
        'feature.invite.desc': '持有Pass解鎖推薦權益，分享好友共建Debear Party社區。',
        
        'feature.dao.title': 'DAO治理與RWA資產',
        'feature.dao.desc': '持有Pass享有DAO治理投票權，未來享有平台手續費分紅、RWA資產收益分配和GameFi特權。',
        
        'feature.security.title': '安全可靠',
        'feature.security.desc': '基於 Berachain 主網部署，智能合約經過審計，資產安全有保障。',
        
        'feature.gamefi.title': 'GameFi與潮流元宇宙',
        'feature.gamefi.desc': '即將推出的社交類GameFi遊戲，結合潮流文化的RWA資產，打造邊玩邊賺的元宇宙體驗。',
        
        // Roadmap
        'roadmap.title': '發展路線圖',
        'roadmap.subtitle': '我們的願景與規劃',
        
        'roadmap.phase1.title': '階段1：啟動與社區建設 (Q2-Q3 2025) ✅',
        'roadmap.phase1.desc': '• Pass銷售（Standard/Premium/Exclusive）<br>• DP代幣上線與初始流動性池<br>• NFT挖礦與T-Engine功能啟動<br>• 社區建設與激勵活動',
        
        'roadmap.phase2.title': '階段2：生態擴展 (Q4 2025 - Q1 2026)',
        'roadmap.phase2.desc': '• GameFi社交遊戲上線<br>• DAO治理系統啟動<br>• RWA潮流資產模塊開發<br>• 流動性質押與PoL獎勵',
        
        'roadmap.milestone.title': '里程碑目標',
        'roadmap.milestone.desc': '• 階段1：2,000個Pass售罄，1000+社區成員，TVL達到$500萬<br>• 階段2：TVL攀升至$2000萬，月活用戶5000+，RWA資產上線',
        
        'roadmap.vision.title': '未來願景',
        'roadmap.vision.desc': '• 成為Berachain最具創新性的潮流元宇宙平台<br>• 連接Web3技術與潮流文化<br>• 構建公平透明的價值生態系統',
        
        // Footer
        'footer.about.title': '關於我們',
        'footer.about.desc': 'Debear Party 是基於 Berachain 的創新型Web3.0綜合平台，擁有 DeFi、GameFi、RWA，致力於打造去中心化的社區生態系統。',
        
        'footer.developer.title': '開發者',
        'footer.developer.whitepaper': '白皮書',
        'footer.developer.contract': '智能合約',
        'footer.developer.audit': '審計報告',
        'footer.developer.github': 'GitHub',
        'footer.developer.test': 'Debear Party 完整測試頁面',
        
        'footer.community.title': '社區',
        'footer.community.discord': 'Discord',
        'footer.community.twitter': 'Twitter',
        'footer.community.telegram': 'Telegram',
        'footer.community.medium': 'Medium',
        'footer.community.help': '幫助中心',
        
        'footer.copyright': '© 2025 Debear Party. All rights reserved. Built on Berachain.',
        
        // Toast 消息
        'toast.wallet.noProvider': '請安裝 MetaMask 或 OKX Wallet！',
        'toast.wallet.switchNetwork': '請切換到 Berachain 主網 (Chain ID: 80094)',
        'toast.wallet.connecting': '連接錢包中...',
        'toast.wallet.connected': '錢包連接成功！',
        'toast.wallet.failed': '連接錢包失敗',
        
        // Loading
        'loading.default': '加載中...',
        'loading.connecting': '連接錢包中...',
        
        // 語言選擇器
        'lang.en': 'English',
        'lang.zh': '繁體中文',
        
        // T-Engine 頁面
        'tengine.title': 'T-Engine',
        'tengine.subtitle': 'T-Engine系統 - 持續獲得DP Token獎勵',
        'tengine.nextRelease': '下次釋放',
        'tengine.pendingReward': '待領取獎勵',
        'tengine.claimReward': '領取獎勵',
        'tengine.totalStake': '全網質押總量:',
        'tengine.myRemaining': '我的剩餘份額:',
        'tengine.myStake': '我的質押:',
        'tengine.totalClaimed': '累計領取:',
        'tengine.stakeAmount': '質押數量 (DP Token)',
        'tengine.balance': '餘額:',
        'tengine.stake': '質押',
        'tengine.whatIs': '🚀 什麼是 T-Engine？',
        'tengine.intro1': 'T-Engine 是 Debear Party 生态系统的核心挖矿引擎。通过质押 DP Token，用户可以启动 T-Engine 进行持续挖矿，获得丰厚的 DP Token 奖励。',
        'tengine.intro2': 'T-Engine 每天释放剩余份额的0.3%，确保公平分配和可持续发展。无论您是小额质押还是大额投资，都能获得相应的收益回报。',
        'tengine.howTo': '🔄 如何使用？',
        'tengine.step1': '<strong>連接錢包：</strong>確保錢包中有足夠的 DP Token',
        'tengine.step2': '<strong>質押代幣：</strong>輸入質押數量，點擊"質押"按鈕',
        'tengine.step3': '<strong>開始挖礦：</strong>質押成功後，T-Engine 自動啟動',
        'tengine.step4': '<strong>領取獎勵：</strong>每天可領取剩餘份額的0.3%，領取時扣10%稅',
        'tengine.step5': '<strong>持續收益：</strong>建議定期領取獎勵並複投，獲得更高收益',
        'tengine.notice': '⚠️ 注意事項',
        'tengine.notice1': '質押操作需要支付少量 Gas 費用（BERA）',
        'tengine.notice2': 'T-Engine 不支持取回質押，僅能領取每日釋放的獎勵',
        'tengine.notice3': '持有 Pass NFT 可获得算力加成（即将开放）',
        'tengine.notice4': '智能合约已经过安全审计，但仍需谨慎投资',
        
        // T-Engine 邀请收益
        'tengine.inviteTitle': '🎁 我的邀请收益',
        'tengine.inviteInfo': '💡 邀请用户质押可获奖励：无 Pass 默认 3% | Standard Pass 8% | Premium Pass 11% | Exclusive Pass 15%',
        'tengine.passLevel': '持有 Pass 等级:',
        'tengine.rewardRate': '当前邀请奖励率:',
        'tengine.acceleratedRelease': '💨 加速释放:',
        'tengine.myReferrals': '👥 我的邀请人数:',
        
        // T-Engine 输入框
        'tengine.inputPlaceholder': '输入质押数量',
        'tengine.modalPlaceholder': '0x... (选填)',
        
        // T-Engine 消息提示
        'tengine.msg.noWallet': '请先连接钱包',
        'tengine.msg.invalidAmount': '请输入有效的质押数量',
        'tengine.msg.approving': '步骤 1/2: 授权 DP Token...',
        'tengine.msg.staking': '步骤 2/2: 执行质押...',
        'tengine.msg.stakeSuccess': '质押成功！T-Engine 已启动',
        'tengine.msg.stakeFailed': '质押失败: ',
        'tengine.msg.claiming': '正在领取奖励...',
        'tengine.msg.claimSuccess': '奖励领取成功！',
        'tengine.msg.claimFailed': '领取失败: ',
        'tengine.msg.noUnstake': 'T-Engine 不支持取回质押，仅能领取奖励',
        'tengine.msg.walletConnected': '钱包连接成功！',
        'tengine.msg.walletFailed': '连接钱包失败: ',
        'tengine.msg.invalidAddress': '请输入有效的以太坡地址格式',
        
        // Swap 頁面
        'swap.title': '💱 Swap',
        'swap.swapTokens': 'Swap Tokens',
        'swap.settings': '設置',
        'swap.from': 'From',
        'swap.to': 'To',
        'swap.balance': 'Balance:',
        'swap.swapButton': 'Swap',
        'swap.selectToken': 'Select Token',
        'swap.customToken': '🔍 輸入自定義代幣地址',
        'swap.addToken': '添加代幣',
        'swap.priceImpact': 'Price Impact:',
        'swap.slippage': 'Slippage:',
        
        // Pass NFT 頁面
        'pass.title': '🎫 Pass NFT',
        'pass.subtitle': '購買專屬 Pass 開啟Debear party探索之旅',
        'pass.buyTab': '購買 Pass NFT',
        'pass.miningTab': 'NFT 挖礦',
        'pass.buyNow': '立即購買',
        'pass.myCollection': '🎨 我的 Pass NFT 收藏',
        'pass.initMining': '啟動 NFT 挖礦',
        'pass.initDescription': '您需要先初始化挖礦系統才能開始賺取 DP Token 獎勵',
        'pass.initialize': '初始化挖礦',
        'pass.nftMining': '🎨 NFT Pass 挖礦',
        'pass.autoMining': '持有Pass自動挖礦，無需質押！每日產出根據Pass等級自動計算。',
        'pass.claimableReward': '可領取獎勵',
        'pass.claimReward': '領取獎勵',
        'pass.standardPass': 'Standard Pass:',
        'pass.premiumPass': 'Premium Pass:',
        'pass.exclusivePass': 'Exclusive Pass:',
        'pass.dailyOutput': '每日產出:',
        'pass.perDay': '/天',
        'pass.lastClaim': '上次領取:',
        'pass.inviteTitle': '🎁 輸入邀請人地址',
        'pass.inviteDesc': '檢測到您是新用戶，請輸入邀請人地址以獲得獎勵，或者跳過使用默認邀請人。',
        'pass.skip': '跳過',
        'pass.confirm': '確認',
        'pass.sendNFT': '📤 發送 Pass NFT',
        'pass.passType': 'Pass 類型:',
        'pass.available': '可用數量:',
        'pass.recipientAddress': '輸入接收方地址 (0x...)',
        'pass.sendAmount': '輸入發送數量',
        'pass.cancel': '取消',
        'pass.send': '發送',
        'pass.ownedAmount': '持有數量:',
        
        // GameFi 頁面
        'gamefi.title': '🎮',
        'gamefi.developing': '遊戲開發中',
        'gamefi.subtitle': '我們正在打造激動人心的 GameFi 體驗<br>敬請期待！',
        'gamefi.competition': '競技對戰',
        'gamefi.playToEarn': '邊玩邊賺',
        'gamefi.nftEquipment': 'NFT 裝備',
        'gamefi.socialInteraction': '社交互動',
        'gamefi.backHome': '返回主頁',
        
        // Whitepaper 白皮書
        'whitepaper.backHome': '← 返回首頁',
        'whitepaper.title': 'Debear Party 白皮書',
        'whitepaper.subtitle': '潮流元宇宙遊戲平台',
        'whitepaper.version': '版本:',
        'whitepaper.releaseDate': '發布日期:',
        'whitepaper.toc': '📋 目錄',
    }
};

/**
 * 国际化管理类
 */
class I18nManager {
    constructor() {
        this.currentLang = 'en'; // Default to English
        this.translations = translations;
        this.init();
    }
    
    init() {
        // Read user's language choice from localStorage, default to English if not set
        const savedLang = localStorage.getItem('language');
        if (savedLang && this.translations[savedLang]) {
            this.currentLang = savedLang;
        } else {
            // Set default language to English if no saved preference
            this.currentLang = 'en';
            localStorage.setItem('language', 'en');
        }
        
        // 应用语言
        this.applyLanguage();
        
        // 更新HTML lang属性
        this.updateHtmlLang();
    }
    
    /**
     * 获取翻译文本
     * @param {string} key - 翻译键名
     * @param {object} params - 替换参数
     * @returns {string}
     */
    t(key, params = {}) {
        let text = this.translations[this.currentLang]?.[key] || key;
        
        // 替换参数
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });
        
        return text;
    }
    
    /**
     * 切换语言
     * @param {string} lang - 语言代码
     */
    setLanguage(lang) {
        if (!this.translations[lang]) {
            console.warn(`Language ${lang} not found`);
            return;
        }
        
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        this.applyLanguage();
        this.updateHtmlLang();
        
        // 触发语言切换事件
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }
    
    /**
     * 获取当前语言
     * @returns {string}
     */
    getCurrentLanguage() {
        return this.currentLang;
    }
    
    /**
     * 应用语言到页面
     */
    applyLanguage() {
        // 翻译所有带 data-i18n 属性的元素
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            // 检查是否有 data-i18n-attr 属性（用于翻译属性而不是文本内容）
            const attr = element.getAttribute('data-i18n-attr');
            if (attr) {
                element.setAttribute(attr, translation);
            } else {
                // 如果包含HTML标签，使用innerHTML，否则使用textContent
                if (translation.includes('<')) {
                    element.innerHTML = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
        
        // 更新语言选择器显示
        this.updateLanguageSelector();
    }
    
    /**
     * 更新HTML lang属性
     */
    updateHtmlLang() {
        document.documentElement.setAttribute('lang', this.currentLang === 'zh-TW' ? 'zh-TW' : 'en');
    }
    
    /**
     * 更新语言选择器显示
     */
    updateLanguageSelector() {
        const langBtn = document.querySelector('.lang-btn');
        if (langBtn) {
            const langText = this.currentLang === 'en' ? 'EN' : '繁';
            langBtn.textContent = langText;
        }
        
        // 更新语言下拉菜单的选中状态
        document.querySelectorAll('.lang-option').forEach(option => {
            const lang = option.getAttribute('data-lang');
            if (lang === this.currentLang) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }
    
    /**
     * 添加新的翻译键值对
     * @param {string} lang - 语言代码
     * @param {string} key - 键名
     * @param {string} value - 翻译值
     */
    addTranslation(lang, key, value) {
        if (!this.translations[lang]) {
            this.translations[lang] = {};
        }
        this.translations[lang][key] = value;
    }
}

// 创建全局实例
const i18n = new I18nManager();

// 导出到window对象
window.i18n = i18n;

// 监听DOM变化，自动翻译新添加的元素
if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    // 翻译新添加的元素
                    if (node.hasAttribute && node.hasAttribute('data-i18n')) {
                        const key = node.getAttribute('data-i18n');
                        const translation = i18n.t(key);
                        const attr = node.getAttribute('data-i18n-attr');
                        
                        if (attr) {
                            node.setAttribute(attr, translation);
                        } else {
                            if (translation.includes('<')) {
                                node.innerHTML = translation;
                            } else {
                                node.textContent = translation;
                            }
                        }
                    }
                    
                    // 翻译子元素
                    node.querySelectorAll?.('[data-i18n]').forEach(element => {
                        const key = element.getAttribute('data-i18n');
                        const translation = i18n.t(key);
                        const attr = element.getAttribute('data-i18n-attr');
                        
                        if (attr) {
                            element.setAttribute(attr, translation);
                        } else {
                            if (translation.includes('<')) {
                                element.innerHTML = translation;
                            } else {
                                element.textContent = translation;
                            }
                        }
                    });
                }
            });
        });
    });
    
    // 开始观察
    document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
