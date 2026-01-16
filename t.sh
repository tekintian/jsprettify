

# rm -rf node_modules package-lock.json dist/
# # 2. 安装依赖（prettier 2.8.8 会被自动安装）
# npm install

# # 3. 执行打包命令
# npm run build


echo "🔨 开始测试 JSPrettify..."
rm -rf dist && mkdir dist
node index.js test_data/test.min.js dist/test0.js
echo "done"
echo "🔨 构建可执行文件..."
rm -rf dist && mkdir dist
pkg src/index.js --public --publicPackages '*' --targets node18-macos-x64 --output dist/jsprettify
./dist/jsprettify test_data/test.min.js dist/test1.js
