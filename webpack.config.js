const path = require('path');

module.exports = {
  entry: './src/index.js',
  target: 'node',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  externals: {
    // 将 prettier 打包进去，因为它是运行时必需的
  },
  resolve: {
    extensions: ['.js', '.json'],
  },
};