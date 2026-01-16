#!/bin/bash

# 测试 SEA 构建的脚本

set -e

echo "🧪 测试 Node.js v20+ SEA 构建"
echo "=============================="

# 检查 Node.js 版本
echo "检查 Node.js 版本..."
node -v

echo ""
echo "步骤 1: 清理并安装依赖..."
npm install

echo ""
echo "步骤 2: 打包 JavaScript..."
npm run bundle

echo ""
echo "步骤 3: 创建 SEA 配置..."
cat > sea-config.json << EOF
{
  "main": "dist/bundle.js",
  "output": "dist/sea-prep.blob",
  "disableExperimentalSEAWarning": true
}
EOF

echo "配置内容:"
cat sea-config.json

echo ""
echo "步骤 4: 生成 SEA blob..."
node --experimental-sea-config sea-config.json

echo ""
echo "步骤 5: 复制 Node.js 二进制..."
cp $(command -v node) dist/jsprettify-test

echo ""
echo "步骤 6: 移除签名（macOS）..."
codesign --remove-signature dist/jsprettify-test 2>/dev/null || true

echo ""
echo "步骤 7: 注入 blob..."
npx postject dist/jsprettify-test NODE_SEA_BLOB dist/sea-prep.blob \
    --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 \
    --macho-segment-name NODE_SEA --overwrite

echo ""
echo "步骤 8: 重新签名（macOS）..."
codesign --sign - dist/jsprettify-test 2>/dev/null || true

echo ""
echo "步骤 9: 设置权限..."
chmod +x dist/jsprettify-test

echo ""
echo "步骤 10: 测试运行..."
echo "测试 1: 显示帮助信息"
./dist/jsprettify-test

echo ""
echo "测试 2: 格式化测试文件..."
if [ -f "test_data/test.min.js" ]; then
    ./dist/jsprettify-test test_data/test.min.js dist/test_output.js
    echo "✓ 格式化成功"
    ls -lh dist/test_output.js
else
    echo "⚠  未找到测试文件，跳过格式化测试"
fi

echo ""
echo "=============================="
echo "✅ 测试完成！"
echo "可执行文件: dist/jsprettify-test"
echo "=============================="