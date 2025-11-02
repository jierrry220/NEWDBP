// Kodiak Finance API Integration Module
// Berachain Mainnet (Chain ID: 80094)

class KodiakAPI {
    constructor() {
        // Kodiak API endpoint
        this.apiEndpoint = 'https://backend.kodiak.finance/quote';
        
        // Berachain Mainnet Chain ID
        this.chainId = 80094;
        
        // Token address mappings for Kodiak API
        this.tokenAddressMap = {
            '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE': 'BERA', // Native BERA
            '0x6969696969696969696969696969696969696969': '0x6969696969696969696969696969696969696969', // WBERA
            '0xfcbd14dc51f0a4d49d5e53c2e0950e0bc26d0dce': '0xfcbd14dc51f0a4d49d5e53c2e0950e0bc26d0dce'  // HONEY
        };
    }
    
    /**
     * 将代币地址转换为 Kodiak API 接受的格式
     */
    normalizeTokenAddress(address) {
        const lowerAddress = address.toLowerCase();
        
        // Check if it's native BERA
        if (lowerAddress === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
            return 'BERA';
        }
        
        // Return the actual address for other tokens
        return address;
    }
    
    /**
     * 将人类可读格式转换为 wei 格式
     */
    convertToWei(amount, decimals = 18) {
        const amountFloat = parseFloat(amount);
        
        if (isNaN(amountFloat) || amountFloat <= 0) {
            return '0';
        }
        
        const multiplier = BigInt(10) ** BigInt(decimals);
        const [integerPart, decimalPart = ''] = amount.toString().split('.');
        const paddedDecimal = decimalPart.padEnd(decimals, '0').substring(0, decimals);
        const weiAmount = BigInt(integerPart) * multiplier + BigInt(paddedDecimal || '0');
        
        return weiAmount.toString();
    }
    
    /**
     * 从 Kodiak API 获取交换报价
     */
    async getQuote(tokenInAddress, tokenOutAddress, amount, recipient = null, slippageTolerance = null, decimals = 18) {
        try {
            // Normalize token addresses
            const tokenIn = this.normalizeTokenAddress(tokenInAddress);
            const tokenOut = this.normalizeTokenAddress(tokenOutAddress);
            
            // Convert amount to wei format
            const amountInWei = this.convertToWei(amount, decimals);
            
            // Build query parameters
            const params = new URLSearchParams({
                tokenInAddress: tokenIn,
                tokenInChainId: this.chainId.toString(),
                tokenOutAddress: tokenOut,
                tokenOutChainId: this.chainId.toString(),
                amount: amountInWei,
                type: 'exactIn'
            });
            
            // Add optional parameters
            if (recipient) {
                params.append('recipient', recipient);
            }
            
            if (slippageTolerance !== null) {
                params.append('slippageTolerance', slippageTolerance.toString());
            }
            
            // Make API request
            const url = `${this.apiEndpoint}?${params.toString()}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Kodiak API error: ${response.status} - ${errorText}`);
            }
            
            const data = await response.json();
            return data;
            
        } catch (error) {
            console.error('Kodiak API request failed:', error);
            throw new Error(`无法从 Kodiak 获取报价: ${error.message}`);
        }
    }
    
    /**
     * 格式化报价数据供 UI 使用
     */
    formatQuote(quoteData) {
        const quoteDecimals = quoteData.quoteDecimals || '0';
        const amountDecimals = quoteData.amountDecimals || '1';
        
        return {
            amountOut: quoteDecimals,
            amountOutRaw: quoteData.quote || '0',
            rate: parseFloat(quoteDecimals) / parseFloat(amountDecimals) || 0,
            priceImpact: Math.abs(parseFloat(quoteData.priceImpact || 0)),
            gasEstimate: quoteData.gasUseEstimate || 0,
            gasEstimateUSD: quoteData.gasUseEstimateUSD || '0',
            gasPriceWei: quoteData.gasPriceWei || '0',
            methodParameters: quoteData.methodParameters || null,
            provider: quoteData.provider || 'Unknown',
            routeString: quoteData.routeString || 'N/A',
            tokenInPriceUSD: quoteData.tokenInPriceUSD || '0',
            tokenOutPriceUSD: quoteData.tokenOutPriceUSD || '0',
            amountUSD: quoteData.amountDecimalsUSD || '0',
            quoteUSD: quoteData.quoteDecimalsUSD || '0'
        };
    }
    
    /**
     * 获取可执行的交换数据
     */
    async getSwapData(tokenInAddress, tokenOutAddress, amount, recipient, slippageTolerance = 1, decimals = 18) {
        try {
            // 获取包含 calldata 的完整报价
            const quoteData = await this.getQuote(
                tokenInAddress,
                tokenOutAddress,
                amount,
                recipient,
                slippageTolerance,
                decimals
            );
            
            // 确保返回了 methodParameters
            if (!quoteData.methodParameters) {
                throw new Error('Kodiak API 未返回交易数据');
            }
            
            return {
                quote: this.formatQuote(quoteData),
                to: quoteData.methodParameters.to,
                data: quoteData.methodParameters.calldata,
                value: quoteData.methodParameters.value || '0x0',
                rawQuote: quoteData
            };
            
        } catch (error) {
            console.error('Failed to get swap data from Kodiak:', error);
            throw error;
        }
    }
}

// 导出单例
window.KodiakAPI = KodiakAPI;
