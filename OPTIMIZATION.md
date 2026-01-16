# Node.js SEA 体积优化方案

## 问题分析

Node.js v24 SEA 构建体积大的原因：

1. **完整 Node.js 二进制**：Node.js SEA 使用完整的 Node.js 可执行文件（v24 约 100MB+）
2. **pkg 使用精简运行时**：pkg 使用了定制的、精简的 Node.js 运行时（约 40-50MB）
3. **blob 文件**：注入的 blob 文件（包含你的代码和依赖）约 2-3MB

## 优化方案

### 方案 1：使用 UPX 压缩（推荐）

UPX 可以显著减小体积，但可能被某些杀毒软件误报（false positive）：

```bash
# 安装 upx
brew install upx  # macOS
# 或
sudo apt-get install upx  # Linux

# 压缩可执行文件
upx --best --lzma dist/jsprettify-macos-x64

# 压缩后体积通常减小 50-70%（124MB → 40-50MB）
```

### 方案 2：使用 Node.js v20 SEA（折中）

Node.js v20 的二进制比 v24 小约 10-15MB，且 SEA 功能已稳定：

```bash
# 使用 Node.js v20
nvm use 20
bash build.sh
```

### 方案 3：继续使用 pkg（如果你主要关心体积）

如果体积是首要考虑因素，可以回退到 pkg：

```bash
# 恢复 pkg 版本
git checkout package.json build.sh .github/workflows/build.yml
npm install
bash build.sh
```

### 方案 4：并行支持两种方案

在项目中同时支持两种构建方式：

```bash
# 构建 pkg 版本（体积小）
npm run build:pkg

# 构建 SEA 版本（官方方案）
npm run build:sea
```

### 方案 5：删除调试符号

```bash
# macOS
strip -S dist/jsprettify-macos-x64

# Linux
strip --strip-unneeded dist/jsprettify-linux-x64
```

## 性能对比

| 方案 | 体积 | 启动速度 | 兼容性 | 维护性 |
|------|------|---------|--------|--------|
| pkg | ~50MB | 快 | 良好 | 社区维护 |
| Node.js SEA (v20+) | ~120MB | 快 | 完美 | 官方支持 |
| Node.js SEA + UPX | ~45MB | 稍慢 | 良好 | 官方支持 |

## 建议

**对于大多数用户，推荐使用方案 1（UPX 压缩）**：
- 体积接近 pkg
- 保留官方 SEA 方案的所有优势
- 被误报的概率很低（jsprettify 是合法工具）

**在 build.sh 中添加自动压缩：**

```bash
# 在注入 blob 后添加
if command -v upx &> /dev/null; then
    echo "  压缩可执行文件..."
    upx --best --lzma "dist/${OUTPUT_NAME}${EXTENSION}"
fi
```
