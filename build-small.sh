#!/bin/bash

# JSPrettify 构建脚本 - 最小体积版本

set -e

echo "🔨 构建最小体积版本 JSPrettify..."
echo "=========================================="

# 检查 Node.js 版本
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js v20+ 需要. 当前版本: $(node -v)"
    exit 1
fi

# 清理并创建 dist 目录
rm -rf dist
mkdir -p dist

# 安装依赖
echo "📦 安装依赖..."
npm install --production

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

echo ""
echo "原始 Node.js 二进制大小:"
ls -lh $(which node) | awk '{print $5}'

echo ""
echo "Bundle 大小:"
ls -lh dist/bundle.js | awk '{print $5}'

echo ""
echo "Blob 大小:"
ls -lh dist/sea-prep.blob | awk '{print $5}'

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
    
    # 移除签名（macOS）
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
    echo "  删除调试符号..."
    strip -S "dist/${OUTPUT_NAME}${EXTENSION}" 2>/dev/null || true
    
    # UPX 压缩
    if command -v upx &> /dev/null && [ "$IS_WINDOWS" != "true" ]; then
        echo "  使用 UPX 压缩..."
        local BEFORE_SIZE=$(stat -f%z "dist/${OUTPUT_NAME}${EXTENSION}" 2>/dev/null || stat -c%s "dist/${OUTPUT_NAME}${EXTENSION}" 2>/dev/null)
        upx --best --lzma "dist/${OUTPUT_NAME}${EXTENSION}" > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            local AFTER_SIZE=$(stat -f%z "dist/${OUTPUT_NAME}${EXTENSION}" 2>/dev/null || stat -c%s "dist/${OUTPUT_NAME}${EXTENSION}" 2>/dev/null)
            local REDUCTION=$((100 - (AFTER_SIZE * 100 / BEFORE_SIZE)))
            echo "  ✅ 压缩成功，体积减小 ${REDUCTION}%"
        else
            echo "  ⚠️  压缩失败（跳过）"
        fi
    fi
    
    # 显示最终大小
    echo "  最终大小: $(ls -lh "dist/${OUTPUT_NAME}${EXTENSION}" | awk '{print $5}')"
    
    echo "  ✅ $PLATFORM 构建完成"
}

# 构建当前平台
if [[ "$OSTYPE" == "darwin"* ]]; then
    ARCH=$(uname -m)
    build_platform "macOS $ARCH" "jsprettify-macos-$ARCH" "" "false"
elif [[ "$OSTYPE" == "linux"* ]]; then
    ARCH=$(uname -m)
    build_platform "Linux $ARCH" "jsprettify-linux-$ARCH" "" "false"
else
    echo "⚠️  不支持的平台: $OSTYPE"
fi

echo ""
echo "=========================================="
echo "✅ 最小体积构建完成！"
echo "=========================================="
echo ""
echo "文件列表:"
ls -lh dist/
echo ""
echo "与 pkg 版本对比:"
echo "  pkg 版本:        ~50MB"
echo "  SEA 未压缩:      ~120MB"
echo "  SEA + UPX 压缩:  ~40-50MB"
echo ""
echo "结论: SEA + UPX 压缩后体积与 pkg 相当"
echo ""