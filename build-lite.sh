#!/bin/bash

# 使用 npx pkg 打包 Lite 版本

echo "🔨 打包 Lite 版本..."

# 清理旧文件
rm -f dist/jsprettify-lite-*

# 使用 npx 调用 pkg（不需要安装）
npx pkg@5.8.1 index-lite.js --no-bytecode --public \
  --targets node18-macos-x64,node18-linux-x64,node18-win-x64 \
  --output dist/jsprettify-lite

# 重命名文件以包含平台名称
mv dist/jsprettify-lite-macos dist/jsprettify-lite-macos 2>/dev/null || true
mv dist/jsprettify-lite-linux dist/jsprettify-lite-linux 2>/dev/null || true
mv dist/jsprettify-lite-win.exe dist/jsprettify-lite-win.exe 2>/dev/null || true

echo ""
echo "✅ Lite 版本打包完成！"
echo ""
echo "文件列表:"
ls -lh dist/
