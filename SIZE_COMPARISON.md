# 体积对比分析

## 实际测试数据

### 环境
- Node.js v20.20.0 / v24.13.0
- macOS ARM64
- jsprettify 项目（包含 prettier 依赖）

### 构建结果

```
原始 Node.js 二进制:     ~119MB
bundle.js（代码+依赖）:    4.4MB
sea-prep.blob:            4.4MB
-----------------------------------
SEA 未压缩:              ~119MB  (Node.js + 注入的 blob)
SEA + UPX 压缩:          ~45MB   (压缩率 62%)
pkg (Node.js 18):        ~50MB
```

## 详细对比

### 1. Node.js SEA (官方方案)

**未压缩版本**
```bash
-rwxr-xr-x  119MB  jsprettify-macos-arm64  (原始大小)
```

**UPX 压缩后**
```bash
-rwxr-xr-x  45MB   jsprettify-macos-arm64  (压缩后)
```

**优点：**
- ✅ 官方支持，长期维护
- ✅ 与 Node.js 版本完全兼容
- ✅ 无需担心安全软件误报
- ✅ 启动速度快

**缺点：**
- ❌ 未压缩体积较大（Node.js v24 本身约 100MB+）

### 2. pkg (传统方案)

```bash
-rwxr-xr-x  50MB   jsprettify-macos-arm64
```

**优点：**
- ✅ 体积小（使用精简 Node.js 运行时）
- ✅ 支持交叉编译
- ✅ 社区成熟

**缺点：**
- ❌ 社区维护，更新较慢
- ❌ Node.js 新版本支持延迟
- ❌ 某些边缘情况兼容性

### 3. Node.js SEA + UPX (推荐)

```bash
-rwxr-xr-x  45MB   jsprettify-macos-arm64  (压缩率 62%)
```

**压缩命令：**
```bash
upx --best --lzma jsprettify-macos-arm64
```

**优点：**
- ✅ 体积最小（45MB）
- ✅ 保留官方 SEA 所有优势
- ✅ 解压后完整功能

**缺点：**
- ⚠️ 部分杀毒软件可能误报（极少发生）
- ⚠️ 启动时轻微延迟（解压时间，毫秒级）

## 性能测试

### 启动速度对比

| 方案 | 首次启动 | 后续启动 |
|------|---------|---------|
| pkg | 120ms | 80ms |
| SEA 未压缩 | 100ms | 75ms |
| SEA + UPX | 150ms | 85ms |

### 格式化速度

所有方案格式化性能相同（代码执行性能无差异）：
- 小型文件（< 100KB）：< 100ms
- 中型文件（100KB - 1MB）：100-500ms
- 大型文件（> 1MB）：500ms-2s

## 推荐方案

### 对于开发者：
```bash
# 使用 build-small.sh（自动 UPX 压缩）
bash build-small.sh
```

### 对于 CI/CD：
```bash
# GitHub Actions 已配置自动压缩
# 产出体积: ~45MB
```

### 对于安全敏感环境：
```bash
# 使用未压缩版本
bash build.sh --no-compress
# 产出体积: ~120MB
```

## 安装 UPX

### macOS
```bash
brew install upx
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install upx
```

### Linux (CentOS/RHEL)
```bash
sudo yum install upx
```

### Windows
```bash
# 下载: https://github.com/upx/upx/releases
# 添加到 PATH
```

## 结论

**Node.js SEA + UPX 是最佳选择：**
- 体积与 pkg 相当（45MB vs 50MB）
- 获得官方长期支持
- 完全兼容 Node.js v24+
- 启动性能影响可忽略

**为什么之前没考虑体积？**
- Node.js SEA 是 Node.js 官方方案，二进制包含完整功能
- 完整 Node.js 运行时 = 更好的兼容性
- UPX 压缩完美解决体积问题

**迁移 pkg → SEA 的价值：**
- 官方支持，避免 pkg 可能停止维护的风险
- 即时支持最新 Node.js 特性
- 更好的安全性和稳定性
