#!/bin/bash

# rm -rf node_modules/ package-lock.json
# npm i

echo "🔨 Starting Build JSPrettify..."

# Clean previous build and test output
rm -rf dist/ test_output.js

# 使用 ncc 构建
npx @vercel/ncc build src/index.js -o dist --minify

# 设置适当的权限并重命名文件
chmod +x dist/index.js
mv dist/index.js dist/jsprettify

echo "🚀 测试打包后的文件 dist/jsprettify"

# 测试打包后的文件
dist/jsprettify test_data/test.min.js  test_output.js