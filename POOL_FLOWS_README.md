# 矿池流水记录功能说明

## 功能概述

在 admin.html 管理界面中新增了矿池流水记录查询功能，可以实时查看：

1. **NFT 矿池流出记录**：所有用户从 NFT 挖矿池 claim DP 的记录
2. **T-Engine 投入记录**：所有用户向 T-Engine 矿池 deposit 的 DP 记录
3. **T-Engine 领取记录**：所有用户从 T-Engine 矿池 claim DP 的记录

## 技术实现

### 后端 API

**文件**：`api/pool-flows.js`

**端点**：`/api/pool-flows?type={type}&limit={limit}`

**参数**：
- `type`（必需）：
  - `nft-claims` - NFT 矿池 claim 记录
  - `tengine-deposits` - T-Engine 投入记录
  - `tengine-claims` - T-Engine claim 记录
- `limit`（可选）：返回记录数量，默认 100
- `fromBlock`（可选）：起始区块，默认 'earliest'
- `toBlock`（可选）：结束区块，默认 'latest'

**工作原理**：
- 通过 Berachain RPC (https://rpc.berachain.com) 查询链上 Transfer 事件
- NFT claims：查询 `Transfer(from=NFT_MINING_POOL, to=user)` 事件
- **T-Engine deposits**：查询 `Transfer(from=user, to=0x0)` 事件（**DP Token 被销毁**）
- T-Engine claims：查询 `Transfer(from=T_ENGINE_POOL, to=user)` 事件
- 结果按时间倒序排列，带 1 分钟缓存
- 区块范围：默认查询最近 9000 个区块（RPC 限制 10000）

**响应格式**：
```json
{
  "success": true,
  "type": "nft-claims",
  "count": 10,
  "data": [
    {
      "txHash": "0x...",
      "blockNumber": 12345,
      "timestamp": 1699999999,
      "from": "0x0D9b...",
      "to": "0xabc...",
      "amount": "123.45",
      "amountRaw": "123450000000000000000",
      "type": "claim"
    }
  ]
}
```

### 前端界面

**文件**：`owner/admin.html`

**新增卡片**：
1. **NFT 矿池流出记录卡片**（蓝色边框）
2. **T-Engine 投入记录卡片**（紫色边框）
3. **T-Engine 领取记录卡片**（绿色边框）

**功能**：
- 页面加载时自动获取最新 50 条记录
- 每个卡片带"刷新"按钮，可手动刷新
- 显示：时间、用户地址、DP 数量、交易链接
- 统计：总笔数、总金额
- 交易链接跳转到 https://berascan.com

## 使用方法

### 1. 安装依赖

```bash
npm install
```

这会安装 `ethers` v5.7.2

### 2. 启动服务器

```bash
npm start
```

服务器默认运行在 http://localhost:3000

### 3. 访问管理界面

打开浏览器访问：
```
http://localhost:3000/owner/admin.html
```

滚动到页面底部，即可看到三个矿池流水记录卡片。

### 4. 手动刷新

点击每个卡片上的"🔄 刷新"按钮，可以实时获取最新数据。

## 配置说明

### 合约地址

在 `api/pool-flows.js` 中配置：

```javascript
const NFT_MINING_POOL = '0x0D9bfaC27128EA2754179400eB932F13B7c52097';
const T_ENGINE_POOL = '0xd9661D56659B80A875E42A51955434A0818581D8';
const DP_TOKEN = '0xf7C464c7832e59855aa245Ecc7677f54B3460e7d';
```

### RPC 节点

默认使用 Berachain 主网 RPC：
```javascript
const RPC_URL = process.env.BERACHAIN_RPC || 'https://rpc.berachain.com';
```

可通过环境变量 `BERACHAIN_RPC` 覆盖。

### 缓存时长

默认 1 分钟缓存：
```javascript
const CACHE_TTL = 60000; // 1 分钟
```

## 性能优化

1. **缓存机制**：同一查询 1 分钟内返回缓存数据，减少 RPC 调用
2. **限制数量**：默认返回最新 50-100 条记录
3. **批量查询**：使用 `getLogs` 批量获取事件，避免逐笔查询
4. **异步加载**：前端三个表格并行加载，互不阻塞

## 故障排查

### 1. API 返回 500 错误

**原因**：RPC 节点连接失败或区块查询超时

**解决**：
- 检查网络连接
- 尝试更换 RPC 节点
- 减小查询范围（设置 `fromBlock` 为最近的区块号）

### 2. 数据加载缓慢

**原因**：查询历史区块数据量大

**解决**：
- 减少 `limit` 参数
- 设置 `fromBlock` 为较新的区块号
- 增加缓存时长

### 3. 前端显示"加载失败"

**原因**：后端 API 未正确配置或服务未启动

**解决**：
- 确认服务器已启动（`npm start`）
- 检查浏览器控制台错误信息
- 确认 API 路由已在 `server.js` 中正确添加

## API 测试

可以直接在浏览器或使用 curl 测试 API：

```bash
# 测试 NFT claims
curl "http://localhost:3000/api/pool-flows?type=nft-claims&limit=10"

# 测试 T-Engine deposits
curl "http://localhost:3000/api/pool-flows?type=tengine-deposits&limit=10"

# 测试 T-Engine claims
curl "http://localhost:3000/api/pool-flows?type=tengine-claims&limit=10"
```

## 扩展建议

### 1. 添加分页功能

在前端添加"加载更多"按钮，支持翻页查看历史记录。

### 2. 时间筛选

添加日期选择器，可以查询特定时间段的记录。

### 3. 用户筛选

添加地址输入框，查询特定用户的流水记录。

### 4. 数据导出

添加"导出 CSV"按钮，方便数据分析。

### 5. 实时推送

使用 WebSocket 推送最新交易，无需手动刷新。

## 维护说明

### 定期检查

1. 确认合约地址未变更
2. 验证 RPC 节点可用性
3. 检查缓存是否过期

### 日志监控

服务器会输出详细日志：
```
🔍 查询 NFT 池 Transfer 事件...
✅ 找到 15 条 NFT claim 记录
```

可通过日志诊断问题。

## 总结

该功能通过链上事件查询，实现了对矿池资金流动的实时监控，帮助管理员：
- 了解用户 claim 行为
- 监控矿池流入流出
- 分析用户参与度
- 辅助运营决策

无需额外的链下数据库，直接从区块链获取可信数据。
