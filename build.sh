#!/bin/bash

# JSPrettify 构建脚本 - 使用 Node.js v20+ 官方单可执行应用方案

set -e

echo "🔨 开始打包 JSPrettify (Node.js SEA)..."

# 检查 Node.js 版本
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js v20+ 需要. 当前版本: $(node -v)"
    echo "   Node.js SEA 功能在 v18.16.0+、v19.7.0+、v20.x+ 中可用"
    exit 1
fi

# 清理并创建 dist 目录
rm -rf dist
mkdir -p dist

# 安装依赖
echo "📦 安装依赖..."
npm install

# 打包 JavaScript 代码（包含所有依赖）
echo "📦 打包 JavaScript..."
if ! command -v webpack &> /dev/null; then
    echo "安装 webpack..."
    npm install -g webpack webpack-cli
fi
npm run bundle

# 创建 SEA 配置文件
cat > sea-config.json << EOF
{
  "main": "dist/bundle.js",
  "output": "dist/sea-prep.blob",
  "disableExperimentalSEAWarning": true
}
EOF

# 生成 blob 文件
echo "🔧 生成 SEA blob..."
node --experimental-sea-config sea-config.json

# 平台构建函数
build_platform() {
    local PLATFORM=$1
    local OUTPUT_NAME=$2
    local EXTENSION=$3
    local IS_WINDOWS=$4
    
    echo ""
    echo "📦 构建 $PLATFORM..."
    
    # 复制 node 二进制
    if [ "$IS_WINDOWS" = "true" ]; then
        node -e "require('fs').copyFileSync(process.execPath, 'dist/${OUTPUT_NAME}${EXTENSION}')"
    else
        cp $(command -v node) "dist/${OUTPUT_NAME}${EXTENSION}"
    fi
    
    # 移除签名（macOS 和 Windows）
    if [[ "$PLATFORM" == *"macOS"* ]]; then
        codesign --remove-signature "dist/${OUTPUT_NAME}${EXTENSION}" 2>/dev/null || true
    fi
    
    # 注入 blob
    echo "  注入 blob..."
    if [[ "$PLATFORM" == *"macOS"* ]]; then
        npx postject "dist/${OUTPUT_NAME}${EXTENSION}" NODE_SEA_BLOB dist/sea-prep.blob \
            --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 \
            --macho-segment-name NODE_SEA --overwrite
    elif [ "$IS_WINDOWS" = "true" ]; then
        npx postject "dist/${OUTPUT_NAME}${EXTENSION}" NODE_SEA_BLOB dist/sea-prep.blob \
            --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 --overwrite
    else
        npx postject "dist/${OUTPUT_NAME}${EXTENSION}" NODE_SEA_BLOB dist/sea-prep.blob \
            --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 --overwrite
    fi
    
    # 重新签名（macOS）
    if [[ "$PLATFORM" == *"macOS"* ]]; then
        codesign --sign - "dist/${OUTPUT_NAME}${EXTENSION}" 2>/dev/null || true
    fi
    
    # 设置可执行权限（非 Windows）
    if [ "$IS_WINDOWS" != "true" ]; then
        chmod +x "dist/${OUTPUT_NAME}${EXTENSION}"
    fi
    
    # 删除调试符号（非 Windows）
    if [ "$IS_WINDOWS" != "true" ]; then
        echo "  删除调试符号..."
        strip -S "dist/${OUTPUT_NAME}${EXTENSION}" 2>/dev/null || true
    fi
    
    # UPX 压缩（如果可用）
    if command -v upx &> /dev/null && [ "$IS_WINDOWS" != "true" ]; then
        echo "  压缩可执行文件..."
        upx --best --lzma "dist/${OUTPUT_NAME}${EXTENSION}" > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            echo "  ✅ 压缩成功"
        else
            echo "  ⚠️  压缩失败（跳过）"
        fi
    fi
    
    echo "  ✅ $PLATFORM 构建完成"
}

# 构建所有平台
echo ""
echo "========================================="
echo "开始构建各平台版本..."
echo "========================================="

# macOS ARM64 (当前机器架构)
if [[ "$OSTYPE" == "darwin"* ]] && [[ $(uname -m) == "arm64" ]]; then
    build_platform "macOS ARM64" "jsprettify-macos-arm64" "" "false"
fi

# macOS x64 (当前机器架构)
if [[ "$OSTYPE" == "darwin"* ]] && [[ $(uname -m) == "x86_64" ]]; then
    build_platform "macOS x64" "jsprettify-macos-x64" "" "false"
fi

# Linux (当前机器架构)
if [[ "$OSTYPE" == "linux"* ]]; then
    build_platform "Linux" "jsprettify-linux-$(uname -m)" "" "false"
fi

# Windows (交叉构建需要在 Windows 上运行)
echo ""
echo "⚠️  Windows 版本需要在 Windows 系统上构建"

echo ""
echo "========================================="
echo "✅ 构建完成！可执行文件在 dist/ 目录下"
echo "========================================="
echo ""
echo "文件列表:"
ls -lh dist/
echo ""
echo "🚀 使用方法:"
echo "  ./dist/jsprettify-<platform> input.min.js [output.js]"
echo ""
echo "💡 提示:"
echo "  - 每个平台的可执行文件只能在该平台运行"
echo "  - 要构建 Windows 版本，请在 Windows 上运行此脚本"
echo "  - 要构建其他架构，请在相应架构的机器上运行"
echo ""
