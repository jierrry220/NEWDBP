// Vercel Serverless Function for Ave API proxy
// Deploy to Vercel: https://vercel.com

const AVE_API_URL = 'https://prod.ave-api.com/v2/tokens/price';
const DP_TOKEN_ID = '0xf7c464c7832e59855aa245ecc7677f54b3460e7d-berachain';

module.exports = async (req, res) => {
    // CORS headers - allow all origins
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    res.setHeader('Access-Control-Max-Age', '86400');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    try {
        // Get API key from environment variable
        const AVE_API_KEY = process.env.AVE_API_KEY;
        
        if (!AVE_API_KEY) {
            throw new Error('AVE_API_KEY environment variable not set');
        }
        
        // Fetch from Ave API
        const response = await fetch(AVE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': AVE_API_KEY,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                token_ids: [DP_TOKEN_ID],
                tvl_min: 0,
                tx_24h_volume_min: 0
            })
        });
        
        if (!response.ok) {
            throw new Error(`Ave API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Return data
        res.status(200).json(data);
        
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch from Ave API', 
            message: error.message 
        });
    }
};
