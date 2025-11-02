// DP Price Chart Component
// Uses Chart.js for visualization and Ave API for data

class DPPriceChart {
    constructor(canvasId, aveAPI) {
        this.canvasId = canvasId;
        this.aveAPI = aveAPI;
        this.chart = null;
        this.priceHistory = [];
        this.maxDataPoints = 20; // Keep last 20 data points
        this.updateInterval = 15000; // Update every 15 seconds
        this.updateTimer = null;
        
        this.init();
    }
    
    async init() {
        // Check if API is configured
        if (!this.aveAPI.isConfigured()) {
            this.showError('请配置 Ave API Key');
            return;
        }
        
        // Initialize chart
        this.createChart();
        
        // Load initial data
        await this.updatePriceData();
        
        // Start auto-update
        this.startAutoUpdate();
    }
    
    createChart() {
        const canvas = document.getElementById(this.canvasId);
        if (!canvas) {
            console.error(`Canvas element ${this.canvasId} not found`);
            return;
        }
        
        const ctx = canvas.getContext('2d');
        
        // Chart.js gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(0, 196, 239, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 196, 239, 0.01)');
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'DP Price (USD)',
                    data: [],
                    borderColor: '#00c4ef',
                    backgroundColor: gradient,
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: '#00c4ef',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(10, 14, 26, 0.9)',
                        borderColor: '#00c4ef',
                        borderWidth: 1,
                        titleColor: '#fff',
                        bodyColor: '#a0b1d4',
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return '$' + context.parsed.y.toFixed(6);
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(0, 196, 239, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#a0b1d4',
                            maxRotation: 0,
                            maxTicksLimit: 8
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(0, 196, 239, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#a0b1d4',
                            callback: function(value) {
                                return '$' + value.toFixed(6);
                            }
                        },
                        beginAtZero: false
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }
    
    async updatePriceData() {
        try {
            const priceData = await this.aveAPI.getDPPrice();
            
            // Update price info display
            this.updatePriceInfo(priceData);
            
            // Add to history
            const timestamp = new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            this.priceHistory.push({
                time: timestamp,
                price: priceData.price
            });
            
            // Keep only last N data points
            if (this.priceHistory.length > this.maxDataPoints) {
                this.priceHistory.shift();
            }
            
            // Update chart
            this.updateChart();
            
        } catch (error) {
            console.error('Failed to update price data:', error);
            this.showError('无法获取价格数据');
        }
    }
    
    updateChart() {
        if (!this.chart) return;
        
        // Update chart data
        this.chart.data.labels = this.priceHistory.map(d => d.time);
        this.chart.data.datasets[0].data = this.priceHistory.map(d => d.price);
        
        // Update chart
        this.chart.update('none'); // 'none' for no animation on update
    }
    
    updatePriceInfo(priceData) {
        // Update price display
        const priceElement = document.getElementById('dpCurrentPrice');
        if (priceElement) {
            priceElement.textContent = '$' + this.aveAPI.formatPrice(priceData.price);
        }
        
        // Update 24h change
        const changeElement = document.getElementById('dpPriceChange24h');
        if (changeElement) {
            const change = priceData.priceChange24h;
            const changeText = (change >= 0 ? '+' : '') + change.toFixed(2) + '%';
            changeElement.textContent = changeText;
            changeElement.className = change >= 0 ? 'price-change-positive' : 'price-change-negative';
        }
        
        // Update market cap
        const mcapElement = document.getElementById('dpMarketCap');
        if (mcapElement) {
            mcapElement.textContent = '$' + this.aveAPI.formatLargeNumber(priceData.marketCap);
        }
        
        // Update 24h volume
        const volumeElement = document.getElementById('dpVolume24h');
        if (volumeElement) {
            volumeElement.textContent = '$' + this.aveAPI.formatLargeNumber(priceData.volume24h);
        }
        
        // Update TVL
        const tvlElement = document.getElementById('dpTVL');
        if (tvlElement) {
            tvlElement.textContent = '$' + this.aveAPI.formatLargeNumber(priceData.tvl);
        }
        
        // Update last updated time
        const updateTimeElement = document.getElementById('dpLastUpdate');
        if (updateTimeElement) {
            const now = new Date();
            updateTimeElement.textContent = 'Updated: ' + now.toLocaleTimeString();
        }
    }
    
    startAutoUpdate() {
        // Clear existing timer if any
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
        }
        
        // Set up new timer
        this.updateTimer = setInterval(() => {
            this.updatePriceData();
        }, this.updateInterval);
    }
    
    stopAutoUpdate() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
            this.updateTimer = null;
        }
    }
    
    showError(message) {
        const errorElement = document.getElementById('chartError');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    destroy() {
        this.stopAutoUpdate();
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}

// Export for use in other modules
window.DPPriceChart = DPPriceChart;
