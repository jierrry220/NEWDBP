const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');

// 环境变量配置
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';

// 缓存配置函数
function getCacheControl(extname) {
    // JS/CSS/图片缓存 1 年
    if (['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf'].includes(extname)) {
        return 'public, max-age=31536000, immutable';
    }
    // HTML 缓存 5 分钟
    if (extname === '.html') {
        return 'public, max-age=300, must-revalidate';
    }
    // JSON 缓存 1 小时
    if (extname === '.json') {
        return 'public, max-age=3600';
    }
    return 'public, max-age=3600';
}

// 生成 ETag
function generateETag(content) {
    return crypto.createHash('md5').update(content).digest('hex').substring(0, 27);
}

const server = http.createServer(async (req, res) => {
    const url = req.url.split('?')[0];
    
    // 健康检查端点
    if (url === '/health' || url === '/healthz') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
        return;
    }
    
    // 处理 API 路由
    if (url === '/api/ave-price') {
        try {
            const aveApiHandler = require('./api/ave-price.js');
            
            const mockRes = {
                statusCode: 200,
                headers: {},
                setHeader(key, value) {
                    this.headers[key] = value;
                },
                status(code) {
                    this.statusCode = code;
                    return this;
                },
                json(data) {
                    res.writeHead(this.statusCode, { ...this.headers, 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(data));
                },
                end() {
                    res.writeHead(this.statusCode, this.headers);
                    res.end();
                }
            };
            
            await aveApiHandler(req, mockRes);
            return;
        } catch (error) {
            console.error('API route error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error', message: error.message }));
            return;
        }
    }
    
    // 默认访问 index.html
    let filePath = url === '/' ? '/index.html' : url;
    filePath = path.join(__dirname, filePath);

    const extname = path.extname(filePath).toLowerCase();
    
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - 页面未找到</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('服务器错误: ' + error.code);
            }
        } else {
            const etag = generateETag(content);
            
            const headers = {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'DENY',
                'X-XSS-Protection': '1; mode=block',
                'Cache-Control': getCacheControl(extname),
                'ETag': `"${etag}"`
            };
            
            const clientETag = req.headers['if-none-match'];
            if (clientETag === `"${etag}"`) {
                res.writeHead(304, headers);
                res.end();
                return;
            }
            
            const shouldCompress = /\.(html|css|js|json|svg)$/.test(filePath);
            const acceptEncoding = req.headers['accept-encoding'] || '';
            
            if (shouldCompress && acceptEncoding.includes('gzip')) {
                headers['Content-Encoding'] = 'gzip';
                const compressed = zlib.gzipSync(content);
                res.writeHead(200, headers);
                res.end(compressed);
            } else {
                res.writeHead(200, headers);
                res.end(content, 'utf-8');
            }
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Debear Party server started on port ${PORT}`);
    console.log(`📍 Environment: ${NODE_ENV}`);
    console.log(`⏰ Started at: ${new Date().toISOString()}`);
});

// 优雅关闭
process.on('SIGTERM', () => {
    console.log('正在关闭服务器...');
    server.close(() => {
        console.log('服务器已关闭');
        process.exit(0);
    });
});
