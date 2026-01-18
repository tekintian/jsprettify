# JSPrettify - JavaScript 代码美化和解压缩工具

<div align="center">
  <p>
    <a href="./README.md">English</a> | 
    <a href="#readme">中文</a>
  </p>
</div>

JSPrettify 是一个强大的 JavaScript 代码美化和解压缩工具，能够格式化压缩过的 JavaScript 代码，使其易于阅读和理解。它支持多种 JavaScript 框架和库的代码格式化。

## 🚀 功能特性

- ✅ **智能格式化**: 自动识别 JavaScript 代码风格并进行格式化
- ✅ **多框架支持**: 支持 React, Vue, Angular, jQuery 等主流框架
- ✅ **语法高亮**: 提供清晰的语法高亮显示
- ✅ **批量处理**: 支持批量格式化多个文件
- ✅ **跨平台**: 支持 Windows, macOS, Linux 等多种操作系统
- ✅ **高性能**: 基于 Prettier 引擎，格式化速度快且准确

## 📦 安装方法

### 方式一：下载预编译版本（推荐）

访问 [Releases 页面](https://github.com/tekintian/jsprettify/releases) 下载最新的预编译版本。

### 方式二：从源码构建

```bash
# 克隆仓库
git clone https://github.com/tekintian/jsprettify.git
cd jsprettify

# 安装依赖
npm install

# 构建项目
# Unix/Linux/macOS:
./build.sh

# 跨平台 (PowerShell):
./build.ps1

# 或者使用 npm scripts:
npm run build
```

## 🔧 使用方法

### 1. 直接使用构建产物

```bash
# Unix/Linux/macOS
./dist/jsprettify input.js output.js

# Windows (PowerShell)
node dist/jsprettify input.js output.js
```

### 2. 使用运行脚本（推荐）

```bash
# Unix/Linux/macOS
./dist/run-unix.sh input.js output.js

# Windows (PowerShell)
./dist/run-windows.ps1 input.js output.js
```

### 3. 作为 Node.js 模块使用

```javascript
const prettier = require('prettier');
const fs = require('fs');

// 读取源代码
const sourceCode = fs.readFileSync('input.js', 'utf8');

// 格式化代码
const formattedCode = prettier.format(sourceCode, {
  parser: 'babel',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
});

// 写入输出文件
fs.writeFileSync('output.js', formattedCode);
```

## 🛠️ 构建脚本

项目提供多种构建脚本以适应不同平台：

- `build.sh`: Unix/Linux/macOS 构建脚本
- `build.ps1`: 跨平台 PowerShell 构建脚本（支持 Windows, macOS, Linux）
- `t.sh`: 快速测试构建脚本

### 使用 PowerShell 构建脚本

```powershell
# 基本构建
.\build.ps1

# 清理并重新构建
.\build.ps1 -Clean

# 显示帮助
.\build.ps1 -Help
```

## ⚙️ 配置选项

JSPrettify 使用 Prettier 作为格式化引擎，支持以下配置选项：

- **parser**: JavaScript 解析器 (默认: babel)
- **tabWidth**: 缩进宽度 (默认: 2)
- **semi**: 是否添加分号 (默认: true)
- **singleQuote**: 是否使用单引号 (默认: true)
- **trailingComma**: 对象属性末尾逗号 (默认: none)

## 🧪 测试

运行测试以验证构建是否成功：

```bash
# Unix/Linux/macOS
npm test
./dist/jsprettify test_data/test.min.js test_output.js

# Windows (PowerShell)
npm test
node dist/jsprettify test_data/test.min.js test_output.js
```

## 📄 命令行参数

- `input.js`: 输入的 JavaScript 文件路径
- `output.js`: 输出的格式化文件路径（可选，默认为标准输出）

## 🔗 相关资源

- [Prettier](https://prettier.io/): 代码格式化工具
- [Node.js](https://nodejs.org/): JavaScript 运行时环境
- [GitHub 仓库](https://github.com/tekintian/jsprettify): 项目源码

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进 JSPrettify！

## 📄 许可证

MIT License

---

**作者**: tekintian  
**邮箱**: tekintian@gmail.com  
**网站**: https://dev.tekin.cn  
**GitHub**: https://github.com/tekintian/jsprettify