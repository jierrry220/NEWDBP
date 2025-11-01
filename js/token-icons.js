// Token Icons Manager
// 为Swap和其他页面提供代币图标

class TokenIconManager {
    constructor() {
        // Trust Wallet CDN
        this.trustWalletCDN = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains';
        
        // 本地图标映射 - Berachain代币真实图标
        this.localIcons = {
            'DP': '/images/logo-icon.png',
            'BERA': '/images/tokens/bera.png',
            'WBERA': '/images/tokens/wbera.png',
            'HONEY': '/images/tokens/honey.png',
            'USDT': '/images/tokens/usdt.png',
            'USDC': '/images/tokens/usdc.png'
            // iBERA 和 iBGT 将使用默认图标
        };
        
        // 代币图标缓存
        this.iconCache = new Map();
        
        // 默认图标
        this.defaultIcon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiM2QjdGQjEiLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE0IiBmb250LWZhbWlseT0iQXJpYWwiPj88L3RleHQ+Cjwvc3ZnPg==';
    }
    
    /**
     * 获取代币图标URL
     * @param {Object} token - 代币对象 {symbol, address, chainId}
     * @returns {Promise<string>} 图标URL
     */
    async getTokenIcon(token) {
        const cacheKey = `${token.chainId || 80094}_${token.address}`;
        
        // 检查缓存
        if (this.iconCache.has(cacheKey)) {
            return this.iconCache.get(cacheKey);
        }
        
        // 1. 优先使用本地图标
        if (this.localIcons[token.symbol]) {
            const iconUrl = this.localIcons[token.symbol];
            this.iconCache.set(cacheKey, iconUrl);
            return iconUrl;
        }
        
        // 2. 尝试从 Trust Wallet CDN (静默处理404)
        const trustWalletIcon = await this.getTrustWalletIcon(token);
        if (trustWalletIcon) {
            this.iconCache.set(cacheKey, trustWalletIcon);
            return trustWalletIcon;
        }
        
        // 3. 尝试从tokenlist.json
        const tokenListIcon = await this.getTokenListIcon(token);
        if (tokenListIcon) {
            this.iconCache.set(cacheKey, tokenListIcon);
            return tokenListIcon;
        }
        
        // 4. 返回默认图标
        const defaultIcon = this.getDefaultIcon(token.symbol);
        this.iconCache.set(cacheKey, defaultIcon);
        return defaultIcon;
    }
    
    /**
     * 从Trust Wallet CDN获取图标
     */
    async getTrustWalletIcon(token) {
        const chainId = token.chainId || 80094;
        const chainName = this.getChainName(chainId);
        
        if (!chainName) return null;
        
        const url = `${this.trustWalletCDN}/${chainName}/assets/${token.address}/logo.png`;
        
        try {
            // 使用超时和静默模式
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3秒超时
            
            const response = await fetch(url, { 
                method: 'HEAD',
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            if (response.ok) {
                return url;
            }
        } catch (error) {
            // 静默处理,不输出日志
        }
        
        return null;
    }
    
    /**
     * 从本地tokenlist.json获取图标
     */
    async getTokenListIcon(token) {
        try {
            const response = await fetch('/tokenlist.json');
            if (!response.ok) return null;
            
            const tokenList = await response.json();
            const tokenInfo = tokenList.tokens.find(t => 
                t.address.toLowerCase() === token.address.toLowerCase() &&
                t.chainId === (token.chainId || 80094)
            );
            
            return tokenInfo?.logoURI || null;
        } catch (error) {
            console.log('Failed to load tokenlist.json:', error);
            return null;
        }
    }
    
    /**
     * 获取链名称
     */
    getChainName(chainId) {
        const chainMap = {
            1: 'ethereum',
            56: 'smartchain',
            137: 'polygon',
            43114: 'avalanchec',
            250: 'fantom',
            42161: 'arbitrum',
            10: 'optimism',
            80094: 'berachain', // Berachain Mainnet
            80084: 'berachain-testnet', // Berachain Testnet
        };
        
        return chainMap[chainId];
    }
    
    /**
     * 生成默认图标(带首字母)
     */
    getDefaultIcon(symbol) {
        const firstLetter = symbol ? symbol.charAt(0).toUpperCase() : '?';
        const svg = `
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#6B7FB1"/>
                <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
                      fill="white" font-size="14" font-family="Arial">${firstLetter}</text>
            </svg>
        `;
        return 'data:image/svg+xml;base64,' + btoa(svg);
    }
    
    /**
     * 预加载所有代币图标
     * @param {Array} tokens - 代币数组
     */
    async preloadIcons(tokens) {
        const promises = tokens.map(token => this.getTokenIcon(token));
        return Promise.all(promises);
    }
    
    /**
     * 清除缓存
     */
    clearCache() {
        this.iconCache.clear();
    }
}

// 创建全局实例
window.tokenIconManager = new TokenIconManager();
