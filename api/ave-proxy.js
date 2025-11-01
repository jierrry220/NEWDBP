// Ave API CORS Proxy for Zeabur
// 用于解决浏览器跨域问题

module.exports = async (req, res) => {
    // 允许所有域名访问（生产环境建议限制为你的域名）
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-KEY, Accept');
    
    // 处理预检请求
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    try {
        const { endpoint, method = 'POST', body } = req.body;
        
        // Ave API 配置
        const baseURL = 'https://prod.ave-api.com';
        const apiKey = '7h7NW15y2nApmvp4iyKZ6Ql6HSCPe3irICJKtMK0vKbbYDvohfsyTgwZ55t2QfNL';
        
        // 构建完整 URL
        const url = `${baseURL}${endpoint}`;
        
        console.log('Proxying request to:', url);
        
        // 转发请求到 Ave API
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': apiKey,
                'Accept': 'application/json'
            },
            body: body ? JSON.stringify(body) : undefined
        });
        
        if (!response.ok) {
            throw new Error(`Ave API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // 返回数据
        res.status(200).json(data);
        
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch from Ave API', 
            message: error.message 
        });
    }
};
