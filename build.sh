#!/bin/bash

# JSPrettify 构建脚本

echo "🔨 开始打包 JSPrettify..."

# 检查是否安装了 pkg
if ! command -v pkg &> /dev/null; then
    echo "❌ pkg 未安装，正在安装..."
    npm install -g pkg
fi

rm -rf dist
# 创建 dist 目录
mkdir -p dist

# macOS ARM64 (Apple Silicon M1/M2/M3)
echo "📦 打包 macOS ARM64..."
pkg src/index.js --public --publicPackages '*' --targets node18-macos-arm64 --output dist/jsprettify-macos-arm64

# macOS x64 (Intel)
echo "📦 打包 macOS x64..."
pkg src/index.js --public --publicPackages '*' --targets node18-macos-x64 --output dist/prettify-macos-x64

# Linux
echo "📦 打包 Linux..."
pkg src/index.js --public --publicPackages '*' --targets node18-linux-x64 --output dist/jsprettify-linux-x64

# Windows
echo "📦 打包 Windows..."
pkg src/index.js --public --publicPackages '*' --targets node18-win-x64 --output dist/jsprettify-win-x64.exe

echo ""
echo "========================================="
echo "✅ 所有平台打包完成！可执行文件在 dist/ 目录下"
echo "========================================="
echo ""
echo "文件列表:"
ls -lh dist/
echo ""
echo "🚀 使用方法:"
echo "  macOS ARM64:  ./dist/jsprettify-macos-arm64 input.min.js [output.js]"
echo "  macOS x64:    ./dist/jsprettify-macos-x64 input.min.js [output.js]"
echo "  Linux:        ./dist/jsprettify-linux-x64 input.min.js [output.js]"
echo "  Windows:      dist\\jsprettify-win-x64.exe input.min.js [output.js]"
echo ""
