#!/bin/bash

# JSPrettify 构建脚本

echo "🔨 开始打包 JSPrettify..."

# 检查是否安装了 pkg
if ! command -v pkg &> /dev/null; then
    echo "❌ pkg 未安装，正在安装..."
    npm install -g pkg
fi

# 创建 dist 目录
mkdir -p dist

# ===== Full 版本（完全独立，推荐）=====
echo "📦 打包 Full 版本（完全独立，约 15MB）..."

# macOS ARM64 (Apple Silicon M1/M2/M3)
echo "  - macOS ARM64..."
pkg index-full.js --no-bytecode --public --publicPackages '*' --targets node18-macos-arm64 --output dist/jsprettify-full-macos-arm64

# macOS x64 (Intel)
echo "  - macOS x64..."
pkg index-full.js --no-bytecode --public --publicPackages '*' --targets node18-macos-x64 --output dist/jsprettify-full-macos-x64

# Linux
echo "  - Linux..."
pkg index-full.js --no-bytecode --public --publicPackages '*' --targets node18-linux-x64 --output dist/jsprettify-full-linux-x64

# Windows
echo "  - Windows..."
pkg index-full.js --no-bytecode --public --publicPackages '*' --targets node18-win-x64 --output dist/jsprettify-full-win-x64.exe

echo "✅ Full 版本打包完成"

# ===== Lite 版本（调用系统 Chrome）=====
echo ""
echo "📦 打包 Lite 版本（需要系统 Chrome，约 25MB）..."

# macOS ARM64 (Apple Silicon)
echo "  - macOS ARM64..."
pkg index-lite.js --no-bytecode --public --publicPackages '*' --targets node18-macos-arm64 --output dist/jsprettify-lite-macos-arm64

# macOS x64 (Intel)
echo "  - macOS x64..."
pkg index-lite.js --no-bytecode --public --publicPackages '*' --targets node18-macos-x64 --output dist/jsprettify-lite-macos-x64

# Linux
echo "  - Linux..."
pkg index-lite.js --no-bytecode --public --publicPackages '*' --targets node18-linux-x64 --output dist/jsprettify-lite-linux-x64

# Windows
echo "  - Windows..."
pkg index-lite.js --no-bytecode --public --publicPackages '*' --targets node18-win-x64 --output dist/jsprettify-lite-win-x64.exe

echo "✅ Lite 版本打包完成"

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
echo "Full 版本（推荐）:"
echo "  - 完全独立，无任何外部依赖"
echo "  - 内置 Prettier 格式化"
echo "  - 体积小 (~15MB)"
echo "  - 适用于 CI/CD、服务器、离线环境"
echo ""
echo "Lite 版本:"
echo "  - 调用系统 Chrome 浏览器"
echo "  - 使用 Chrome DevTools Protocol"
echo "  - 格式化效果与 Chrome DevTools 一致"
echo "  - 体积较大 (~25MB)"
echo "  - 适用于开发环境"
echo ""
echo "🚀 使用方法:"
echo "  Full 版本:   ./dist/jsprettify-full-macos-arm64 input.min.js [output.js]"
echo "  Lite 版本:   ./dist/jsprettify-lite-macos-arm64 input.min.js [output.js]"
echo ""
echo "💡 提示: 推荐优先使用 Full 版本，除非需要 Chrome DevTools 的特定格式化效果"
