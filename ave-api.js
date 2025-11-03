// Ave Cloud Data API Integration Module
// https://ave-cloud.gitbook.io/data-api

class AveAPI {
    constructor(apiKey, useProxy = false) {
        // API endpoints
        this.baseURL = 'https://prod.ave-api.com';
        this.backupURL = 'https://data.ave-api.xyz';
        
        // API Key - Replace with your actual key
        this.apiKey = apiKey || 'YOUR_API_KEY_HERE';
        
        // 是否使用代理（解决 CORS 问题）
        this.useProxy = useProxy;
        this.proxyAttempted = false;
        
        // DP Token configuration (Berachain)
        this.dpTokenAddress = '0xf7c464c7832e59855aa245ecc7677f54b3460e7d';
        this.dpTokenId = `${this.dpTokenAddress}-berachain`;
        
        // Cache for price data
        this.priceCache = {
            data: null,
            timestamp: 0,
            cacheDuration: 10000 // 10 seconds cache
        };
    }
    
    /**
     * 检查 API Key 是否已配置
     */
    isConfigured() {
        return this.apiKey && this.apiKey !== 'YOUR_API_KEY_HERE';
    }
    
    
    /**
     * 获取 DP 代币的实时价格信息
     */
    async getDPPrice() {
        // Check cache first
        const now = Date.now();
        if (this.priceCache.data && (now - this.priceCache.timestamp) < this.priceCache.cacheDuration) {
            return this.priceCache.data;
        }
        
        // 自动检测是否需要使用代理（生产环境）
        const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
        
        try {
            let response;
            
            if (isProduction) {
                // 生产环境：使用服务器端代理避免 CORS
                // console.log('Fetching price via proxy');
                response = await fetch('/api/ave-price', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
            } else {
                // 本地开发：直接调用 Ave API
                // console.log('Fetching price from Ave API directly');
                response = await fetch(`${this.baseURL}/v2/tokens/price`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-KEY': this.apiKey,
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        token_ids: [this.dpTokenId],
                        tvl_min: 0,
                        tx_24h_volume_min: 0
                    })
                });
            }
            
            if (!response.ok) {
                throw new Error(`Ave API error: ${response.status}`);
            }
            
            const response_json = await response.json();
            
            // Debug: Log the response
            // console.log('Ave API Response:', response_json);
            
            // Ave API wraps data in a 'data' object
            const data = response_json.data || response_json;
            
            // console.log('Looking for token ID:', this.dpTokenId);
            // console.log('Available keys:', Object.keys(data));
            
            const dpData = data[this.dpTokenId];
            
            if (!dpData) {
                // Try to find DP data with different case variations
                const lowerTokenId = this.dpTokenId.toLowerCase();
                const dpDataLower = Object.keys(data).find(key => key.toLowerCase() === lowerTokenId);
                
                if (dpDataLower) {
                    // console.log('Found DP data with key:', dpDataLower);
                    return this.formatPriceData(data[dpDataLower]);
                }
                
                throw new Error('DP token data not found in API response');
            }
            
            return this.formatPriceData(dpData, now);
            
        } catch (error) {
            console.error('Failed to fetch DP price from Ave API:', error);
            
            // Return cached data if available
            if (this.priceCache.data) {
                console.warn('Using cached price data due to API error');
                return this.priceCache.data;
            }
            
            throw new Error(`无法获取 DP 价格数据: ${error.message}`);
        }
    }
    
    /**
     * 获取 DP 代币的详细信息
     */
    async getDPDetails() {
        try {
            const response = await fetch(`${this.baseURL}/v2/tokens/${this.dpTokenId}`, {
                method: 'GET',
                headers: {
                    'X-API-KEY': this.apiKey,
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Ave API error: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
            
        } catch (error) {
            console.error('Failed to fetch DP details from Ave API:', error);
            throw error;
        }
    }
    
    /**
     * 获取 DP 代币的 K 线数据
     */
    async getDPKlines(interval = '1h', limit = 24) {
        try {
            // Note: You'll need to implement this based on Ave API's klines endpoint
            // This is a placeholder for future implementation
            console.warn('Klines endpoint not yet implemented');
            return null;
        } catch (error) {
            console.error('Failed to fetch DP klines from Ave API:', error);
            throw error;
        }
    }
    
    /**
     * 搜索代币
     */
    async searchToken(keyword, chain = 'berachain', limit = 10) {
        try {
            const params = new URLSearchParams({
                keyword: keyword,
                chain: chain,
                limit: limit.toString()
            });
            
            const response = await fetch(`${this.baseURL}/v2/tokens?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'X-API-KEY': this.apiKey,
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Ave API error: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
            
        } catch (error) {
            console.error('Failed to search token from Ave API:', error);
            throw error;
        }
    }
    
    /**
     * 格式化价格数据对象
     */
    formatPriceData(dpData, timestamp = Date.now()) {
        const priceData = {
            price: parseFloat(dpData.current_price_usd || 0),
            priceChange24h: parseFloat(dpData.price_change_24h || 0),
            priceChange1d: parseFloat(dpData.price_change_1d || 0),
            tvl: parseFloat(dpData.tvl || 0),
            volume24h: parseFloat(dpData.tx_volume_u_24h || 0),
            marketCap: parseFloat(dpData.market_cap || 0),
            fdv: parseFloat(dpData.fdv || 0),
            timestamp: dpData.updated_at || Math.floor(Date.now() / 1000)
        };
        
        // Update cache
        this.priceCache.data = priceData;
        this.priceCache.timestamp = timestamp;
        
        return priceData;
    }
    
    /**
     * 格式化价格显示
     */
    formatPrice(price) {
        if (price >= 1) {
            return price.toFixed(4);
        } else if (price >= 0.01) {
            return price.toFixed(6);
        } else if (price >= 0.0001) {
            return price.toFixed(8);
        } else {
            return price.toExponential(4);
        }
    }
    
    /**
     * 格式化大数字 (K, M, B)
     */
    formatLargeNumber(num) {
        if (num >= 1e9) {
            return (num / 1e9).toFixed(2) + 'B';
        } else if (num >= 1e6) {
            return (num / 1e6).toFixed(2) + 'M';
        } else if (num >= 1e3) {
            return (num / 1e3).toFixed(2) + 'K';
        }
        return num.toFixed(2);
    }
}

// Export for use in other modules
window.AveAPI = AveAPI;
