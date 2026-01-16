# JSPrettify 打包指南

## 📦 两个版本

### Lite 版本（推荐）
- **依赖**: 仅 Prettier
- **特点**: 轻量级，不依赖 Chrome
- **体积**: ~15MB
- **适用**: 大部分格式化场景

### Full 版本
- **依赖**: Chrome DevTools Protocol + 系统 Chrome
- **特点**: 使用 Chrome DevTools 的格式化算法
- **体积**: ~25MB
- **适用**: 需要 Chrome DevTools 特定格式化效果

## 🔧 安装打包工具

```bash
npm install -g pkg
# 或
npm install --save-dev pkg
```

## 🚀 打包命令

### 打包所有版本和平台
```bash
./build.sh
# 或
npm run build
```

### 仅打包 Lite 版本
```bash
npm run build:lite
```

### 仅打包 Full 版本
```bash
npm run build:full
```

### 单独打包各平台
```bash
# Linux
npm run build:linux

# Windows
npm run build:win

# macOS ARM64 (Apple Silicon)
npm run build:mac-arm64

# macOS x64 (Intel)
npm run build:mac-x64
```

## 📝 使用方式

### Lite 版本
```bash
# macOS ARM64 (M1/M2/M3)
./dist/jsprettify-lite-macos-arm64 input.min.js [output.js]

# macOS x64 (Intel)
./dist/jsprettify-lite-macos-x64 input.min.js [output.js]

# Linux
./dist/jsprettify-lite-linux-x64 input.min.js [output.js]

# Windows
dist/jsprettify-lite-win-x64.exe input.min.js [output.js]
```

### Full 版本
```bash
# macOS ARM64 (M1/M2/M3)
./dist/jsprettify-full-macos-arm64 input.min.js [output.js]

# macOS x64 (Intel)
./dist/jsprettify-full-macos-x64 input.min.js [output.js]

# Linux
./dist/jsprettify-full-linux-x64 input.min.js [output.js]

# Windows
dist/jsprettify-full-win-x64.exe input.min.js [output.js]
```

## ⚠️ 注意事项

### Lite 版本
- 不需要 Chrome/Chromium
- 使用 Prettier 作为格式化引擎
- 体积小，分发方便

### Full 版本
- 需要目标系统安装 Chrome/Chromium
- 会自动检测以下位置：
  - **macOS**: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
  - **Windows**: `C:\Program Files\Google\Chrome\Application\chrome.exe`
  - **Linux**: `/usr/bin/google-chrome`
- 使用 Chrome DevTools Protocol 格式化

## 💡 版本选择建议

| 场景 | 推荐版本 | 原因 |
|------|---------|------|
| 常规代码格式化 | Lite | 轻量、快速、无依赖 |
| CI/CD 环境 | Lite | 不需要安装 Chrome |
| 服务器环境 | Lite | 更小的镜像体积 |
| 需要 Chrome 格式化效果 | Full | 与 DevTools 一致 |
| Windows 服务器 | Lite | 避免 Chrome 安装问题 |

## 🏗️ 架构支持

### macOS
- **ARM64** (Apple Silicon M1/M2/M3) - 最新的 Mac 电脑
- **x64** (Intel) - 较老的 Mac 电脑

### 如何选择 macOS 版本？
```bash
# 查看当前 Mac 架构
uname -m

# 输出:
# arm64  -> 使用 macos-arm64 版本
# x86_64 -> 使用 macos-x64 版本
```

### 其他平台
- **Linux**: 仅 x64 架构
- **Windows**: 仅 x64 架构

## 📦 文件说明

打包后的文件：
```
dist/
├── jsprettify-lite-linux-x64       # Linux Lite 版本
├── jsprettify-lite-macos-arm64     # macOS ARM64 Lite 版本
├── jsprettify-lite-macos-x64       # macOS x64 Lite 版本
├── jsprettify-lite-win-x64.exe     # Windows Lite 版本
├── jsprettify-full-linux-x64       # Linux Full 版本
├── jsprettify-full-macos-arm64     # macOS ARM64 Full 版本
├── jsprettify-full-macos-x64       # macOS x64 Full 版本
└── jsprettify-full-win-x64.exe     # Windows Full 版本
```

## 🧪 测试

```bash
# 测试 Lite 版本
./dist/jsprettify-lite-macos-arm64 bg.min.js

# 测试 Full 版本
./dist/jsprettify-full-macos-arm64 bg.min.js
```

## 📦 GitHub Actions 发布

CI 会自动构建以下平台的 Release：

```
Releases/v1.0.0/
├── jsprettify-linux-x64.tar.gz
├── jsprettify-macos-arm64.tar.gz
├── jsprettify-macos-x64.tar.gz
├── jsprettify-win-x64.zip
├── jsprettify-lite-linux-x64
├── jsprettify-lite-macos-arm64
├── jsprettify-lite-macos-x64
├── jsprettify-lite-win-x64.exe
├── jsprettify-full-linux-x64
├── jsprettify-full-macos-arm64
├── jsprettify-full-macos-x64
├── jsprettify-full-win-x64.exe
├── checksums.txt
└── sha256sums.txt
```
