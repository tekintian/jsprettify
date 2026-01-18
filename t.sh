#!/bin/bash
# 测试脚本
# 当前已测试版本 v16.20.2  v20.20.0
# 测试环境：macOS 12.2.1
# 测试结果：通过
# 最低支持版本 v16.0.0 非这以上版本业务功能可能无法正常运行
# 
# 清理和安装依赖
rm -rf node_modules/ package-lock.json
npm i

echo "🔨 Starting Build JSPrettify..."

# Clean previous build and test output
rm -rf dist/ output.js

# 使用 ncc 构建主可执行文件
npx @vercel/ncc build src/index.js -o dist --minify

# 设置适当的权限并重命名文件
chmod +x dist/index.js
mv dist/index.js dist/jsprettify

# Copy run scripts to dist directory
cp run-windows.ps1 dist/
# Make the PowerShell script executable
chmod +x dist/run-windows.ps1

# make the executable file in dist/ directory executable (Unix and macOS)
if [[ "$OSTYPE" == "linux-gnu"* || "$OSTYPE" == "darwin"* ]]; then
    # Make the executable file in dist/ directory executable
    chmod +x dist/jsprettify
    # Copy Unix run script to dist directory
    cp run-unix.sh dist/
    # Make the unix script executable
    chmod +x dist/run-unix.sh
fi

echo "🚀 测试打包后的文件 dist/jsprettify"

# 测试打包后的文件
dist/jsprettify test_data/test.min.js  output.js
