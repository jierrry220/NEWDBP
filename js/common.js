/**
 * Debear Party - Common JavaScript File
 * Includes: Wallet Connection, Mobile Menu, Toast Notifications, Loading, Particle Effects, etc.
 */

// ========================================
// Global Configuration
// ========================================
const CONFIG = {
    BERACHAIN_CHAIN_ID: '0x138de', // 80094 in hex
    BERACHAIN_CHAIN_ID_DECIMAL: 80094,
    OWNER_ADDRESS: '0xd8B4286c2f299220830f7228bab15225b4EA8379', // Owner address (optional)
    PARTICLES_CONFIG: {
        particles: {
            number: { value: 100, density: { enable: true, value_area: 800 } },
            color: { value: ['#00c4ef', '#e900e9', '#4dd0e1', '#d91e5a'] },
            shape: { type: 'circle' },
            opacity: { 
                value: 0.6, 
                random: true, 
                anim: { enable: true, speed: 1, opacity_min: 0.2 } 
            },
            size: { 
                value: 3, 
                random: true, 
                anim: { enable: true, speed: 3, size_min: 0.5 } 
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#00c4ef',
                opacity: 0.3,
                width: 1
            },
            move: {
                enable: true,
                speed: 1.5,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: true, mode: 'grab' },
                onclick: { enable: true, mode: 'push' }
            },
            modes: {
                grab: { distance: 200, line_linked: { opacity: 0.8 } },
                push: { particles_nb: 4 }
            }
        }
    }
};

// ========================================
// Toast Notification System
// ========================================
class ToastManager {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // Create toast container
        if (!document.querySelector('.toast-container')) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        } else {
            this.container = document.querySelector('.toast-container');
        }
    }

    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // Add icon
        const icon = this.getIcon(type);
        toast.innerHTML = `${icon}<span>${message}</span>`;
        
        this.container.appendChild(toast);
        
        // Auto remove
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    this.container.removeChild(toast);
                }
            }, 300);
        }, duration);

        return toast;
    }

    getIcon(type) {
        const icons = {
            info: 'ℹ️',
            success: '✅',
            error: '❌',
            warning: '⚠️'
        };
        return icons[type] || icons.info;
    }

    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration) {
        return this.show(message, 'info', duration);
    }
}

// Global toast instance
const toast = new ToastManager();

// ========================================
// Loading Manager
// ========================================
class LoadingManager {
    constructor() {
        this.overlay = null;
        this.init();
    }

    init() {
        if (!document.querySelector('.loading-overlay')) {
            this.overlay = document.createElement('div');
            this.overlay.className = 'loading-overlay';
            this.overlay.innerHTML = `
                <div class="loading-spinner"></div>
                <div class="loading-text">Loading...</div>
            `;
            // Ensure initial state is hidden
            this.overlay.style.display = 'none';
            document.body.appendChild(this.overlay);
        } else {
            this.overlay = document.querySelector('.loading-overlay');
            // Ensure existing element is also hidden
            this.overlay.classList.remove('active');
            this.overlay.style.display = 'none';
        }
    }

    show(text = 'Loading...') {
        if (this.overlay) {
            const textEl = this.overlay.querySelector('.loading-text');
            if (textEl) {
                textEl.textContent = text;
            }
            this.overlay.style.display = 'flex';
            // Use setTimeout to ensure display takes effect first
            setTimeout(() => {
                this.overlay.classList.add('active');
            }, 10);
            // Prevent page scrolling
            document.body.style.overflow = 'hidden';
        }
    }

    hide() {
        if (this.overlay) {
            this.overlay.classList.remove('active');
            // Wait for animation to end before hiding
            setTimeout(() => {
                this.overlay.style.display = 'none';
            }, 300);
            // Restore page scrolling
            document.body.style.overflow = '';
        }
    }
}

// Global loading instance
const loading = new LoadingManager();

// ========================================
// Wallet Manager
// ========================================
class WalletManager {
    constructor() {
        this.provider = null;
        this.address = null;
        this.isConnected = false;
    }

    // Get wallet provider
    getProvider() {
        if (window.okxwallet) {
            return window.okxwallet;
        } else if (window.ethereum) {
            return window.ethereum;
        }
        return null;
    }

    // Connect wallet
    async connect() {
        try {
            this.provider = this.getProvider();
            
            if (!this.provider) {
                const msg = window.i18n ? window.i18n.t('toast.wallet.noProvider') : 'Please install MetaMask or OKX Wallet!';
                toast.error(msg);
                return null;
            }

            const loadingMsg = window.i18n ? window.i18n.t('loading.connecting') : 'Connecting wallet...';
            loading.show(loadingMsg);

            // Request account permission
            const accounts = await this.provider.request({ 
                method: 'eth_requestAccounts' 
            });

            // Check and switch to Berachain network
            const chainId = await this.provider.request({ method: 'eth_chainId' });
            if (chainId !== CONFIG.BERACHAIN_CHAIN_ID) {
                try {
                    await this.provider.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: CONFIG.BERACHAIN_CHAIN_ID }]
                    });
                } catch (switchError) {
                    loading.hide();
                    const msg = window.i18n ? window.i18n.t('toast.wallet.switchNetwork') : 'Please switch to Berachain Mainnet (Chain ID: 80094)';
                    toast.error(msg);
                    return null;
                }
            }

            this.address = accounts[0];
            this.isConnected = true;

            // Save connection state
            localStorage.setItem('walletConnected', 'true');
            localStorage.setItem('walletAddress', this.address);

            // Update UI
            this.updateUI();

            // Check Owner permissions
            this.checkOwnerAccess();

            loading.hide();
            const successMsg = window.i18n ? window.i18n.t('toast.wallet.connected') : 'Wallet connected successfully!';
            toast.success(successMsg);

            return this.address;
        } catch (error) {
            loading.hide();
            console.error('Connect wallet error:', error);
            const errorMsg = window.i18n ? window.i18n.t('toast.wallet.failed') : 'Failed to connect wallet';
            toast.error(errorMsg + ': ' + error.message);
            return null;
        }
    }

    // Check wallet connection status
    async checkConnection() {
        const wasConnected = localStorage.getItem('walletConnected');
        if (!wasConnected) return false;

        try {
            this.provider = this.getProvider();
            if (!this.provider) return false;

            const accounts = await this.provider.request({ 
                method: 'eth_accounts' 
            });

            if (accounts && accounts.length > 0) {
                this.address = accounts[0];
                this.isConnected = true;
                localStorage.setItem('walletAddress', this.address);
                this.updateUI();
                this.checkOwnerAccess();
                return true;
            } else {
                // Wallet disconnected
                this.disconnect();
                return false;
            }
        } catch (error) {
            console.error('Error checking wallet connection:', error);
            return false;
        }
    }

    // Disconnect wallet
    disconnect() {
        this.isConnected = false;
        this.address = null;
        localStorage.removeItem('walletConnected');
        localStorage.removeItem('walletAddress');
        this.updateUI();
    }

    // Update UI display
    updateUI() {
        const connectBtns = document.querySelectorAll('.connect-btn');
        
        if (this.isConnected && this.address) {
            const shortAddr = this.address.substring(0, 6) + '...' + this.address.substring(38);
            connectBtns.forEach(btn => {
                btn.textContent = shortAddr;
                btn.disabled = true;
            });
        } else {
            const btnText = window.i18n ? window.i18n.t('nav.connect') : 'Connect Wallet';
            connectBtns.forEach(btn => {
                btn.textContent = btnText;
                btn.disabled = false;
            });
        }
    }

    // Check Owner permissions
    checkOwnerAccess() {
        if (!this.address) return;
        
        // Safety check: if OWNER_ADDRESS is not configured, return directly
        if (!CONFIG.OWNER_ADDRESS) return;

        const userAddress = this.address.toLowerCase();
        const ownerAddress = CONFIG.OWNER_ADDRESS.toLowerCase();

        const ownerLink = document.getElementById('owner-link');
        if (ownerLink) {
            ownerLink.style.display = userAddress === ownerAddress ? 'block' : 'none';
        }
    }

    // Get current address
    getAddress() {
        return this.address;
    }

    // Listen for account changes
    onAccountsChanged(callback) {
        if (this.provider) {
            this.provider.on('accountsChanged', (accounts) => {
                if (accounts.length === 0) {
                    this.disconnect();
                } else {
                    this.address = accounts[0];
                    localStorage.setItem('walletAddress', this.address);
                    this.updateUI();
                    this.checkOwnerAccess();
                }
                if (callback) callback(accounts);
            });
        }
    }

    // Listen for network changes
    onChainChanged(callback) {
        if (this.provider) {
            this.provider.on('chainChanged', (chainId) => {
                // Reload page
                window.location.reload();
                if (callback) callback(chainId);
            });
        }
    }
}

// Global wallet instance
const wallet = new WalletManager();

// ========================================
// Mobile Menu Manager
// ========================================
class MobileMenuManager {
    constructor() {
        this.hamburger = null;
        this.menu = null;
        this.overlay = null;
        this.isOpen = false;
        this.init();
    }

    init() {
        this.hamburger = document.querySelector('.hamburger');
        this.menu = document.querySelector('.mobile-menu');
        this.overlay = document.querySelector('.mobile-menu-overlay');

        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => this.toggle());
        }

        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.close());
        }

        // Auto close after clicking menu links
        if (this.menu) {
            const links = this.menu.querySelectorAll('a, button');
            links.forEach(link => {
                link.addEventListener('click', () => {
                    // Delay close to allow page navigation to execute first
                    setTimeout(() => this.close(), 100);
                });
            });
        }
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        this.hamburger?.classList.add('active');
        this.menu?.classList.add('active');
        this.overlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.isOpen = false;
        this.hamburger?.classList.remove('active');
        this.menu?.classList.remove('active');
        this.overlay?.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ========================================
// Navbar Scroll Effect
// ========================================
class NavbarManager {
    constructor() {
        this.navbar = null;
        this.scrollThreshold = 100;
        this.init();
    }

    init() {
        this.navbar = document.querySelector('.navbar');
        if (this.navbar) {
            window.addEventListener('scroll', () => this.handleScroll());
        }
    }

    handleScroll() {
        if (window.scrollY > this.scrollThreshold) {
            this.navbar?.classList.add('scrolled');
        } else {
            this.navbar?.classList.remove('scrolled');
        }
    }
}

// ========================================
// Scroll Animation Observer
// ========================================
class ScrollAnimationManager {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, options);

        // Observe all fade-in elements
        document.querySelectorAll('.fade-in').forEach(el => {
            this.observer.observe(el);
        });
    }

    // Add new element to observation list
    observe(element) {
        if (this.observer && element) {
            this.observer.observe(element);
        }
    }
}

// ========================================
// Particle Background Initialization
// ========================================
function initParticles() {
    if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
        particlesJS('particles-js', CONFIG.PARTICLES_CONFIG);
    }
}

// ========================================
// Smooth Scroll
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        });
    });
}

// ========================================
// Global Connect Wallet Function (backward compatible)
// ========================================
async function connectWallet() {
    return await wallet.connect();
}

// ========================================
// Mobile Menu Toggle Function (backward compatible)
// ========================================
function toggleMobileMenu() {
    if (window.mobileMenu) {
        window.mobileMenu.toggle();
    }
}

// ========================================
// Page Initialization
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle background
    initParticles();

    // Initialize mobile menu
    window.mobileMenu = new MobileMenuManager();

    // Initialize navbar
    window.navbar = new NavbarManager();

    // Initialize scroll animation
    window.scrollAnimation = new ScrollAnimationManager();

    // Initialize smooth scroll
    initSmoothScroll();

    // Check wallet connection status
    wallet.checkConnection();

    // Listen for wallet events
    wallet.onAccountsChanged();
    wallet.onChainChanged();
    
    // Listen for language change events, update wallet button text
    window.addEventListener('languageChanged', () => {
        wallet.updateUI();
    });
});

// ========================================
// Export Global Object
// ========================================
window.DebearParty = {
    wallet,
    toast,
    loading,
    mobileMenu: null, // Will be set in DOMContentLoaded
    navbar: null,
    scrollAnimation: null,
    CONFIG
};
