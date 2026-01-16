const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  target: 'node',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  optimization: {
    minimize: true,
    nodeEnv: 'production',
    // 禁用代码分割，确保单个文件
    splitChunks: false,
    runtimeChunk: false,
  },
  plugins: [
    // 禁用动态导入，确保所有代码打包进单个文件
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
  resolve: {
    extensions: ['.js', '.json'],
  },
  // 排除不必要的文件
  node: {
    __dirname: false,
    __filename: false,
  },
};