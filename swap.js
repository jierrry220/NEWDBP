// Swap Page Logic with Kodiak Integration
// Berachain Mainnet (Chain ID: 80094)

class SwapManager {
    constructor() {
        // Network configuration - Berachain Mainnet
        this.chainId = 80094;
        this.rpcUrl = 'https://rpc.berachain.com';
        this.rpcUrlBackup = 'https://rpc.berachain.com';
        this.explorerUrl = 'https://berascan.com';
        
        // Initialize Kodiak API
        this.kodiakAPI = new KodiakAPI();
        
        // Token definitions
        this.tokens = [
            { 
                name: 'BERA', 
                symbol: 'BERA', 
                address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
                decimals: 18, 
                balance: '0.00',
                isNative: true
            },
            { 
                name: 'WBERA', 
                symbol: 'WBERA', 
                address: '0x6969696969696969696969696969696969696969', 
                decimals: 18, 
                balance: '0.00' 
            },
            { 
                name: 'HONEY', 
                symbol: 'HONEY', 
                address: '0xfcbd14dc51f0a4d49d5e53c2e0950e0bc26d0dce', 
                decimals: 18, 
                balance: '0.00' 
            },
            { 
                name: 'Debear Party Token', 
                symbol: 'DP', 
                address: '0xf7C464c7832e59855aa245Ecc7677f54B3460e7d', 
                decimals: 18, 
                balance: '0.00' 
            },
            { 
                name: 'Tether USD', 
                symbol: 'USDT', 
                address: '0x779ded0c9e1022225f8e0630b35a9b54be713736', 
                decimals: 6, 
                balance: '0.00' 
            },
            { 
                name: 'USD Coin', 
                symbol: 'USDC', 
                address: '0x549943e04f40284185054145c6e4e9568c1d3241', 
                decimals: 6, 
                balance: '0.00' 
            },
            { 
                name: 'Infrared BERA', 
                symbol: 'iBERA', 
                address: '0x9b6761bf2397bb5a6624a856cc84a3a14dcd3fe5', 
                decimals: 18, 
                balance: '0.00' 
            },
            { 
                name: 'Infrared BGT', 
                symbol: 'iBGT', 
                address: '0xac03caba51e17c86c921e1f6cbfbdc91f8bb2e6b', 
                decimals: 18, 
                balance: '0.00' 
            }
        ];
        
        this.currentFromToken = this.tokens[0]; // BERA
        this.currentToToken = this.tokens[3]; // DP
        this.slippageTolerance = 0.5; // Default 0.5%
        
        this.provider = null;
        this.signer = null;
        this.userAddress = null;
        this.isSwapping = false;
        
        // ERC20 ABI
        this.erc20ABI = [
            'function balanceOf(address) view returns (uint256)',
            'function allowance(address owner, address spender) view returns (uint256)',
            'function approve(address spender, uint256 amount) returns (bool)',
            'function decimals() view returns (uint8)',
            'function name() view returns (string)',
            'function symbol() view returns (string)'
        ];
        
        this.init();
    }
    
    async init() {
        // Initialize read-only provider for quotes with retry logic
        try {
            this.provider = new ethers.providers.JsonRpcProvider(this.rpcUrl);
            // Test the connection
            await this.provider.getNetwork();
        } catch (error) {
            console.warn('Primary RPC failed, trying backup:', error);
            try {
                this.provider = new ethers.providers.JsonRpcProvider(this.rpcUrlBackup);
                await this.provider.getNetwork();
            } catch (backupError) {
                console.error('Both RPC endpoints failed:', backupError);
                this.showMessage('Unable to connect to Berachain network, please try again later', 'error');
            }
        }
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Check if wallet is already connected
        this.checkWalletConnection();
    }
    
    setupEventListeners() {
        // Amount input change
        document.getElementById('fromAmount').addEventListener('input', () => {
            this.handleAmountChange();
        });
        
        // MAX button
        document.getElementById('maxFromAmount').addEventListener('click', () => {
            this.setMaxAmount();
        });
        
        // Swap direction button
        document.getElementById('swapDirection').addEventListener('click', () => {
            this.swapTokenDirection();
        });
        
        // Swap button
        document.getElementById('swapBtn').addEventListener('click', () => {
            this.executeSwap();
        });
        
        // Token selectors
        document.getElementById('fromTokenSelector').addEventListener('click', () => {
            this.openTokenModal('from');
        });
        
        document.getElementById('toTokenSelector').addEventListener('click', () => {
            this.openTokenModal('to');
        });
        
        // Close modal when clicking overlay
        document.getElementById('tokenModal').addEventListener('click', (e) => {
            if (e.target.id === 'tokenModal') {
                this.closeTokenModal();
            }
        });
    }
    
    async checkWalletConnection() {
        const walletProvider = window.okxwallet || window.ethereum;
        if (walletProvider && walletProvider.selectedAddress) {
            await connectWallet();
        }
    }
    
    async handleAmountChange() {
        const fromAmount = document.getElementById('fromAmount').value;
        
        if (!fromAmount || fromAmount === '0' || fromAmount === '' || parseFloat(fromAmount) <= 0) {
            document.getElementById('toAmount').value = '';
            document.getElementById('swapDetails').style.display = 'none';
            this.updateSwapButton('Enter Amount');
            return;
        }
        
        try {
            // Get quote from Kodiak
            const quote = await this.getQuoteFromKodiak(fromAmount);
            
            if (quote && quote.amountOut) {
                const outputAmount = parseFloat(quote.amountOut);
                document.getElementById('toAmount').value = outputAmount.toFixed(6);
                
                // Update swap details
                await this.updateSwapDetails(fromAmount, quote);
                
                // Update swap button
                const balance = parseFloat(this.currentFromToken.balance);
                if (this.userAddress) {
                    if (parseFloat(fromAmount) > balance) {
                        this.updateSwapButton('Insufficient Balance');
                    } else {
                        this.updateSwapButton('Swap');
                    }
                } else {
                    this.updateSwapButton('Connect Wallet');
                }
                
                // Show swap details
                document.getElementById('swapDetails').style.display = 'block';
            }
        } catch (error) {
            console.error('Error calculating swap amount:', error);
            this.showMessage('Failed to get quote: ' + error.message, 'error');
        }
    }
    
    async getQuoteFromKodiak(amountIn) {
        try {
            const tokenInAddress = this.currentFromToken.address;
            const tokenOutAddress = this.currentToToken.address;
            
            // Get quote from Kodiak API (without recipient for quote-only)
            const quoteData = await this.kodiakAPI.getQuote(
                tokenInAddress,
                tokenOutAddress,
                amountIn,
                null, // No recipient for quote-only
                null, // No slippage for quote-only
                this.currentFromToken.decimals
            );
            
            // Format quote data
            const formattedQuote = this.kodiakAPI.formatQuote(quoteData);
            
            return {
                amountOut: formattedQuote.amountOut,
                amountOutRaw: formattedQuote.amountOutRaw,
                rate: formattedQuote.rate,
                priceImpact: formattedQuote.priceImpact,
                gasEstimate: formattedQuote.gasEstimate,
                gasEstimateUSD: formattedQuote.gasEstimateUSD,
                gasPriceWei: formattedQuote.gasPriceWei,
                provider: formattedQuote.provider,
                routeString: formattedQuote.routeString,
                rawQuote: quoteData
            };
        } catch (error) {
            console.error('Error getting Kodiak quote:', error);
            throw error;
        }
    }
    
    async updateSwapDetails(fromAmount, quote) {
        // Update rate
        const fromSymbol = this.currentFromToken.symbol;
        const toSymbol = this.currentToToken.symbol;
        document.getElementById('swapRate').textContent = 
            `1 ${fromSymbol} = ${quote.rate.toFixed(4)} ${toSymbol}`;
        
        // Update price impact
        const priceImpactElement = document.getElementById('priceImpact');
        const priceImpact = quote.priceImpact * 100;
        priceImpactElement.textContent = `${priceImpact.toFixed(2)}%`;
        
        // Set color based on impact
        priceImpactElement.className = 'detail-value';
        if (priceImpact < 1) {
            priceImpactElement.classList.add('impact-low');
        } else if (priceImpact < 3) {
            priceImpactElement.classList.add('impact-medium');
        } else {
            priceImpactElement.classList.add('impact-high');
        }
        
        // Update network fee
        const feeUSD = parseFloat(quote.gasEstimateUSD || 0);
        document.getElementById('networkFee').textContent = `~$${feeUSD.toFixed(2)}`;
        
        // Update minimum received (with slippage)
        const minReceived = parseFloat(quote.amountOut) * (1 - this.slippageTolerance / 100);
        document.getElementById('minimumReceived').textContent = 
            `${minReceived.toFixed(6)} ${toSymbol}`;
    }
    
    setMaxAmount() {
        if (!this.userAddress) {
            this.showMessage('Please connect wallet first', 'error');
            return;
        }
        
        const balance = parseFloat(this.currentFromToken.balance);
        if (balance > 0) {
            // Leave some for gas if it's native token
            const maxAmount = this.currentFromToken.isNative ? 
                Math.max(0, balance - 0.01) : balance;
            document.getElementById('fromAmount').value = maxAmount.toFixed(6);
            this.handleAmountChange();
        }
    }
    
    swapTokenDirection() {
        // Swap from and to tokens
        const temp = this.currentFromToken;
        this.currentFromToken = this.currentToToken;
        this.currentToToken = temp;
        
        // Update UI
        document.getElementById('fromTokenSymbol').textContent = this.currentFromToken.symbol;
        document.getElementById('toTokenSymbol').textContent = this.currentToToken.symbol;
        document.getElementById('fromBalance').textContent = this.currentFromToken.balance;
        document.getElementById('toBalance').textContent = this.currentToToken.balance;
        
        // Clear amounts
        document.getElementById('fromAmount').value = '';
        document.getElementById('toAmount').value = '';
        document.getElementById('swapDetails').style.display = 'none';
        this.updateSwapButton('Enter Amount');
    }
    
    openTokenModal(type) {
        this.currentTokenSelectType = type;
        const modal = document.getElementById('tokenModal');
        const tokenList = document.getElementById('tokenList');
        const customSection = document.getElementById('customTokenSection');
        
        // Clear existing list
        tokenList.innerHTML = '';
        
        // Show custom token input only for 'to' selection
        if (type === 'to') {
            customSection.style.display = 'block';
            document.getElementById('customTokenInput').value = '';
        } else {
            customSection.style.display = 'none';
        }
        
        // Filter out currently selected token from the other side
        const currentToken = type === 'from' ? this.currentFromToken : this.currentToToken;
        const otherToken = type === 'from' ? this.currentToToken : this.currentFromToken;
        
        // Populate token list
        this.tokens.forEach(token => {
            // Skip if this is the other side's token
            if (token.address === otherToken.address) return;
            
            const li = document.createElement('li');
            li.className = 'token-item';
            li.innerHTML = `
                <div class="token-item-info">
                    <span class="token-item-symbol">${token.symbol}</span>
                    <span class="token-item-name">${token.name}</span>
                </div>
                <span class="token-item-balance">${token.balance}</span>
            `;
            
            li.addEventListener('click', () => {
                this.selectToken(token, type);
            });
            
            tokenList.appendChild(li);
        });
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeTokenModal() {
        const modal = document.getElementById('tokenModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        document.getElementById('customTokenInput').value = '';
    }
    
    selectToken(token, type) {
        if (type === 'from') {
            this.currentFromToken = token;
            document.getElementById('fromTokenSymbol').textContent = token.symbol;
            document.getElementById('fromBalance').textContent = token.balance;
        } else {
            this.currentToToken = token;
            document.getElementById('toTokenSymbol').textContent = token.symbol;
            document.getElementById('toBalance').textContent = token.balance;
        }
        
        // Close modal
        this.closeTokenModal();
        
        // Clear amounts and re-calculate if needed
        const fromAmount = document.getElementById('fromAmount').value;
        document.getElementById('toAmount').value = '';
        document.getElementById('swapDetails').style.display = 'none';
        
        if (fromAmount && parseFloat(fromAmount) > 0) {
            this.handleAmountChange();
        } else {
            this.updateSwapButton('Enter Amount');
        }
    }
    
    async addCustomToken() {
        const addressInput = document.getElementById('customTokenInput').value.trim();
        
        // Validate address format
        if (!addressInput || !addressInput.match(/^0x[a-fA-F0-9]{40}$/)) {
            this.showMessage('Please enter valid token address', 'error');
            return;
        }
        
        // Check if token already exists
        const existingToken = this.tokens.find(t => 
            t.address.toLowerCase() === addressInput.toLowerCase()
        );
        
        if (existingToken) {
            // If token exists, just select it
            this.selectToken(existingToken, this.currentTokenSelectType);
            return;
        }
        
        // Fetch token details from contract
        try {
            this.showMessage('Fetching token info...', 'info');
            const addBtn = document.getElementById('addCustomTokenBtn');
            addBtn.disabled = true;
            
            const tokenContract = new ethers.Contract(
                addressInput,
                this.erc20ABI,
                this.provider
            );
            
            // Get token details
            const [name, symbol, decimals] = await Promise.all([
                tokenContract.name().catch(() => 'Unknown Token'),
                tokenContract.symbol().catch(() => 'UNKNOWN'),
                tokenContract.decimals().catch(() => 18)
            ]);
            
            // Get balance if wallet connected
            let balance = '0.00';
            if (this.userAddress) {
                const balanceRaw = await tokenContract.balanceOf(this.userAddress);
                balance = parseFloat(ethers.utils.formatUnits(balanceRaw, decimals)).toFixed(4);
            }
            
            // Create custom token object
            const customToken = {
                name: name,
                symbol: symbol,
                address: addressInput,
                decimals: decimals,
                balance: balance,
                isCustom: true
            };
            
            // Add to tokens list
            this.tokens.push(customToken);
            
            // Select the custom token
            this.selectToken(customToken, this.currentTokenSelectType);
            
            this.showMessage(`Token ${symbol} added successfully!`, 'success');
            
        } catch (error) {
            console.error('Error adding custom token:', error);
            this.showMessage('Unable to fetch token info, please check address', 'error');
        } finally {
            const addBtn = document.getElementById('addCustomTokenBtn');
            addBtn.disabled = false;
        }
    }
    
    async executeSwap() {
        if (this.isSwapping) return;
        
        if (!this.signer) {
            this.showMessage('Please connect wallet first', 'error');
            return;
        }

        const swapBtn = document.getElementById('swapBtn');
        const btnText = swapBtn.querySelector('.btn-text');
        
        const fromAmount = document.getElementById('fromAmount').value;
        if (!fromAmount || fromAmount === '0') {
            this.showMessage('Please enter swap amount', 'error');
            return;
        }

        this.isSwapping = true;
        const originalText = btnText.textContent;
        swapBtn.disabled = true;

        try {
            // Step 1: Check and approve token if needed
            if (!this.currentFromToken.isNative) {
                btnText.textContent = 'Checking approval...';
                await this.checkAndApprove(fromAmount);
            }
            
            // Step 2: Execute swap
            btnText.textContent = 'Swapping...';
            const txHash = await this.performSwap(fromAmount);
            
            // Show success message
            this.showMessage(`Swap successful! <a href="${this.explorerUrl}/tx/${txHash}" target="_blank" style="color: inherit; text-decoration: underline;">View transaction</a>`, 'success');
            
            // Update balances
            await this.updateBalances();
            
            // Reset form
            this.resetSwapForm();
            
        } catch (error) {
            console.error('Swap failed:', error);
            
            let errorMsg = error.message;
            if (error.code === 4001) {
                errorMsg = 'User cancelled transaction';
            } else if (errorMsg.includes('insufficient funds')) {
                errorMsg = 'Insufficient balance for transaction and gas fee';
            } else if (errorMsg.includes('INSUFFICIENT_OUTPUT_AMOUNT')) {
                errorMsg = 'Slippage too high, try increasing tolerance';
            }
            
            this.showMessage(errorMsg, 'error');
        } finally {
            this.isSwapping = false;
            btnText.textContent = 'Swap';
            swapBtn.disabled = false;
        }
    }
    
    async checkAndApprove(amount) {
        const tokenContract = new ethers.Contract(
            this.currentFromToken.address, 
            this.erc20ABI, 
            this.signer
        );
        
        const amountWei = ethers.utils.parseUnits(amount, this.currentFromToken.decimals);
        
        // Get the router address from a test quote
        const testQuote = await this.kodiakAPI.getQuote(
            this.currentFromToken.address,
            this.currentToToken.address,
            amount,
            this.userAddress,
            this.slippageTolerance,
            this.currentFromToken.decimals
        );
        
        const routerAddress = testQuote.methodParameters ? testQuote.methodParameters.to : null;
        
        if (!routerAddress) {
            throw new Error('Unable to get router address');
        }
        
        // Check current allowance
        const allowance = await tokenContract.allowance(this.userAddress, routerAddress);
        
        if (allowance.lt(amountWei)) {
            this.showMessage('Approving token...', 'info');
            
            const approveTx = await tokenContract.approve(
                routerAddress,
                ethers.constants.MaxUint256 // Infinite approval
            );
            
            this.showMessage('Waiting for approval...', 'info');
            await approveTx.wait();
            this.showMessage('Token approved successfully!', 'success');
        }
    }
    
    async performSwap(amountIn) {
        const tokenInAddress = this.currentFromToken.address;
        const tokenOutAddress = this.currentToToken.address;
        
        // Get swap data from Kodiak API
        this.showMessage('Getting best route...', 'info');
        const swapData = await this.kodiakAPI.getSwapData(
            tokenInAddress,
            tokenOutAddress,
            amountIn,
            this.userAddress,
            this.slippageTolerance,
            this.currentFromToken.decimals
        );
        
        console.log('Kodiak Swap Data:', swapData);
        
        // Build transaction
        const txParams = {
            to: swapData.to,
            data: swapData.data,
            value: swapData.value,
            from: this.userAddress
        };
        
        // Execute transaction
        this.showMessage('Executing swap...', 'info');
        const tx = await this.signer.sendTransaction(txParams);
        
        // Wait for confirmation
        this.showMessage('Waiting for confirmation...', 'info');
        await tx.wait();
        
        return tx.hash;
    }
    
    resetSwapForm() {
        document.getElementById('fromAmount').value = '';
        document.getElementById('toAmount').value = '';
        document.getElementById('swapDetails').style.display = 'none';
        this.updateSwapButton('Enter Amount');
    }
    
    async updateBalances() {
        if (!this.userAddress) return;
        
        try {
            for (let token of this.tokens) {
                if (token.isNative) {
                    const balance = await this.provider.getBalance(this.userAddress);
                    token.balance = parseFloat(ethers.utils.formatEther(balance)).toFixed(4);
                } else {
                    const tokenContract = new ethers.Contract(
                        token.address,
                        this.erc20ABI,
                        this.provider
                    );
                    const balance = await tokenContract.balanceOf(this.userAddress);
                    token.balance = parseFloat(
                        ethers.utils.formatUnits(balance, token.decimals)
                    ).toFixed(4);
                }
            }
            
            // Update UI
            document.getElementById('fromBalance').textContent = this.currentFromToken.balance;
            document.getElementById('toBalance').textContent = this.currentToToken.balance;
            
        } catch (error) {
            console.error('Failed to update balances:', error);
        }
    }
    
    updateSwapButton(text) {
        const swapBtn = document.getElementById('swapBtn');
        const btnText = swapBtn.querySelector('.btn-text');
        btnText.textContent = text;
        
        if (text === 'Enter Amount' || text === 'Insufficient Balance' || text === 'Connect Wallet') {
            swapBtn.disabled = true;
        } else {
            swapBtn.disabled = false;
        }
    }
    
    showMessage(text, type = 'info') {
        const messageDiv = document.getElementById('message');
        messageDiv.innerHTML = `<div class="alert ${type}">${text}</div>`;
        setTimeout(() => { messageDiv.innerHTML = ''; }, 5000);
    }
}

// Global functions for wallet connection
let swapManager;

async function connectWallet() {
    try {
        const walletProvider = window.okxwallet || window.ethereum;
        if (!walletProvider) {
            swapManager.showMessage('Please install MetaMask or OKX Wallet', 'error');
            return;
        }

        await walletProvider.request({ method: 'eth_requestAccounts' });
        
        const chainId = await walletProvider.request({ method: 'eth_chainId' });
        if (chainId !== '0x138de') {
            try {
                await walletProvider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x138de' }]
                });
            } catch (switchError) {
                // Chain not added, try to add it
                if (switchError.code === 4902) {
                    await walletProvider.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0x138de',
                            chainName: 'Berachain Mainnet',
                            nativeCurrency: {
                                name: 'BERA',
                                symbol: 'BERA',
                                decimals: 18
                            },
                            rpcUrls: ['https://rpc.berachain.com'],
                            blockExplorerUrls: ['https://berascan.com']
                        }]
                    });
                } else {
                    throw switchError;
                }
            }
        }

        swapManager.provider = new ethers.providers.Web3Provider(walletProvider);
        swapManager.signer = swapManager.provider.getSigner();
        swapManager.userAddress = await swapManager.signer.getAddress();

        const shortAddress = swapManager.userAddress.slice(0, 6) + '...' + swapManager.userAddress.slice(-4);
        const connectBtn = document.getElementById('connectBtn');
        const mobileConnectBtn = document.getElementById('mobileConnectBtn');
        
        if (connectBtn) {
            connectBtn.textContent = shortAddress;
            connectBtn.disabled = false;
        }
        
        if (mobileConnectBtn) {
            mobileConnectBtn.textContent = shortAddress;
            mobileConnectBtn.disabled = false;
        }

        // Save connection state
        localStorage.setItem('walletConnected', 'true');
        localStorage.setItem('walletAddress', swapManager.userAddress);

        await swapManager.updateBalances();
        swapManager.showMessage('Wallet connected successfully', 'success');
        
        // Re-calculate quote if amount is entered
        const fromAmount = document.getElementById('fromAmount').value;
        if (fromAmount) {
            swapManager.handleAmountChange();
        }
    } catch (error) {
        console.error('Connection failed:', error);
        swapManager.showMessage('Connection failed: ' + error.message, 'error');
    }
}

// Check and restore wallet connection
async function checkWalletConnection() {
    const wasConnected = localStorage.getItem('walletConnected');
    if (!wasConnected) return;

    try {
        const walletProvider = window.okxwallet || window.ethereum;
        if (!walletProvider) return;

        // Check network first
        const chainId = await walletProvider.request({ method: 'eth_chainId' });
        if (chainId !== '0x138de') {
            console.log('Wrong network, need to switch to Berachain');
            localStorage.removeItem('walletConnected');
            localStorage.removeItem('walletAddress');
            return;
        }

        const accounts = await walletProvider.request({ method: 'eth_accounts' });
        if (accounts && accounts.length > 0) {
            swapManager.provider = new ethers.providers.Web3Provider(walletProvider, 'any');
            swapManager.signer = swapManager.provider.getSigner();
            swapManager.userAddress = await swapManager.signer.getAddress();

            const shortAddress = swapManager.userAddress.slice(0, 6) + '...' + swapManager.userAddress.slice(-4);
            const connectBtn = document.getElementById('connectBtn');
            const mobileConnectBtn = document.getElementById('mobileConnectBtn');
            
            if (connectBtn) {
                connectBtn.textContent = shortAddress;
                connectBtn.disabled = false;
            }
            
            if (mobileConnectBtn) {
                mobileConnectBtn.textContent = shortAddress;
                mobileConnectBtn.disabled = false;
            }

            localStorage.setItem('walletAddress', swapManager.userAddress);

            await swapManager.updateBalances();
        } else {
            localStorage.removeItem('walletConnected');
            localStorage.removeItem('walletAddress');
        }
    } catch (error) {
        console.error('Error checking wallet connection:', error);
        localStorage.removeItem('walletConnected');
        localStorage.removeItem('walletAddress');
    }
}

// Initialize on page load
window.addEventListener('load', async () => {
    swapManager = new SwapManager();
    await checkWalletConnection();
});
