#!/bin/bash

# JSPrettify 构建脚本 - 支持 Lite 和 Full 版本

echo "🔨 开始打包 JSPrettify..."

# 检查是否安装了 pkg
if ! command -v pkg &> /dev/null; then
    echo "❌ pkg 未安装，正在安装..."
    npm install -g pkg
fi

# 创建 dist 目录
mkdir -p dist

# ===== Lite 版本（轻量级，仅 Prettier）=====
echo "📦 打包 Lite 版本（仅 Prettier，约 15MB）..."

# macOS ARM64 (Apple Silicon M1/M2/M3)
echo "  - macOS ARM64..."
pkg index-lite.js --targets node18-macos-arm64 --output dist/jsprettify-lite-macos-arm64

# macOS x64 (Intel)
echo "  - macOS x64..."
pkg index-lite.js --targets node18-macos-x64 --output dist/jsprettify-lite-macos-x64

# Linux
echo "  - Linux..."
pkg index-lite.js --targets node18-linux-x64 --output dist/jsprettify-lite-linux-x64

# Windows
echo "  - Windows..."
pkg index-lite.js --targets node18-win-x64 --output dist/jsprettify-lite-win-x64.exe

echo "✅ Lite 版本打包完成"

# ===== Full 版本（完整功能，依赖系统 Chrome）=====
echo ""
echo "📦 打包 Full 版本（需要系统 Chrome，约 25MB）..."

# macOS ARM64 (Apple Silicon)
echo "  - macOS ARM64..."
pkg index-full.js --targets node18-macos-arm64 --output dist/jsprettify-full-macos-arm64

# macOS x64 (Intel)
echo "  - macOS x64..."
pkg index-full.js --targets node18-macos-x64 --output dist/jsprettify-full-macos-x64

# Linux
echo "  - Linux..."
pkg index-full.js --targets node18-linux-x64 --output dist/jsprettify-full-linux-x64

# Windows
echo "  - Windows..."
pkg index-full.js --targets node18-win-x64 --output dist/jsprettify-full-win-x64.exe

echo "✅ Full 版本打包完成"

echo ""
echo "========================================="
echo "✅ 所有版本打包完成！可执行文件在 dist/ 目录下"
echo "========================================="
echo ""
echo "文件列表:"
ls -lh dist/

echo ""
echo "📝 版本说明:"
echo ""
echo "Lite 版本（推荐）:"
echo "  - 仅使用 Prettier 格式化"
echo "  - 不依赖 Chrome/Chromium"
echo "  - 体积小 (~15MB)"
echo "  - 适用于大部分场景"
echo ""
echo "Full 版本:"
echo "  - 使用 Chrome DevTools Protocol"
echo "  - 需要系统安装 Chrome/Chromium"
echo "  - 体积较大 (~25MB)"
echo "  - 更接近 Chrome DevTools 格式化效果"
echo ""
echo "💡 架构说明:"
echo "  - macOS-arm64: Apple Silicon (M1/M2/M3)"
echo "  - macOS-x64:   Intel Mac"
echo "  - linux-x64:   Linux 64位"
echo "  - win-x64:     Windows 64位"
echo ""
echo "🚀 使用方法:"
echo "  Apple Silicon:  ./dist/jsprettify-lite-macos-arm64 input.min.js [output.js]"
echo "  Intel Mac:      ./dist/jsprettify-lite-macos-x64 input.min.js [output.js]"
echo "  Linux:          ./dist/jsprettify-lite-linux-x64 input.min.js [output.js]"
echo "  Windows:        dist/jsprettify-lite-win-x64.exe input.min.js [output.js]"
echo ""
echo "💡 提示: 推荐优先使用 Lite 版本，除非需要 Chrome DevTools 的特定格式化效果"
