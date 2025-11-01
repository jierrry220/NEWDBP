# Debear Party - Zeabur 部署版本

这是 Debear Party 项目的精简部署版本，专为 Zeabur 平台优化。

## 部署步骤

1. 在 Zeabur 创建新项目
2. 连接此 Git 仓库或直接上传文件夹
3. Zeabur 会自动检测 Node.js 项目并部署
4. 部署完成后，项目会自动运行在指定端口

## 项目结构

```
newDBP/
├── server.js          # Node.js 服务器（核心）
├── package.json       # 项目依赖配置
├── zbpack.json        # Zeabur 配置
├── api/               # API 接口文件夹
│   └── ave-price.js   # 价格查询 API
├── css/               # 样式文件
├── js/                # JavaScript 文件
├── images/            # 图片资源
├── *.html             # HTML 页面文件
└── README.md          # 说明文档

## 环境变量

- `PORT`: 服务端口（Zeabur 会自动设置）
- `NODE_ENV`: 运行环境（默认 production）

## 特性

- ✅ 零构建部署（无需编译）
- ✅ 静态文件服务
- ✅ Gzip 压缩
- ✅ ETag 缓存
- ✅ API 路由支持
- ✅ CORS 支持

## 本地测试

```bash
npm start
```

访问 http://localhost:3000
