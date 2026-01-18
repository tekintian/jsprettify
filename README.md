# JSPrettify - JavaScript Code Beautification and Decompression Tool

<div align="center">
  <p>
    <a href="#readme">English</a> | 
    <a href="./README_CN.md">中文</a>
  </p>
</div>

JSPrettify is a powerful JavaScript code beautification and decompression tool that can format compressed JavaScript code to make it easy to read and understand. It supports formatting code from various JavaScript frameworks and libraries.

## 🚀 Features

- ✅ **Smart Formatting**: Automatically identifies JavaScript code styles and formats them
- ✅ **Multi-framework Support**: Supports popular frameworks like React, Vue, Angular, jQuery
- ✅ **Syntax Highlighting**: Provides clear syntax highlighting
- ✅ **Batch Processing**: Supports batch formatting of multiple files
- ✅ **Cross-platform**: Supports multiple operating systems including Windows, macOS, Linux
- ✅ **High Performance**: Based on Prettier engine for fast and accurate formatting

## 📦 Installation

### Method 1: Download Pre-built Binary (Recommended)

Visit the [Releases page](https://github.com/tekintian/jsprettify/releases) to download the latest pre-built binary.

### Method 2: Build from Source

```bash
# Clone the repository
git clone https://github.com/tekintian/jsprettify.git
cd jsprettify

# Install dependencies
npm install

# Build the project
# Unix/Linux/macOS:
./build.sh

# Cross-platform (PowerShell):
./build.ps1

# Or using npm scripts:
npm run build
```

## 🔧 Usage

### 1. Direct Use of Built Binary

```bash
# Unix/Linux/macOS
./dist/jsprettify input.js output.js

# Windows (PowerShell)
node dist/jsprettify input.js output.js
```

### 2. Using Run Scripts (Recommended)

```bash
# Unix/Linux/macOS
./dist/run-unix.sh input.js output.js

# Windows (PowerShell)
./dist/run-windows.ps1 input.js output.js
```

### 3. As a Node.js Module

```javascript
const prettier = require('prettier');
const fs = require('fs');

// Read source code
const sourceCode = fs.readFileSync('input.js', 'utf8');

// Format code
const formattedCode = prettier.format(sourceCode, {
  parser: 'babel',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
});

// Write output file
fs.writeFileSync('output.js', formattedCode);
```

## 🛠️ Build Scripts

The project provides multiple build scripts for different platforms:

- `build.sh`: Unix/Linux/macOS build script
- `build.ps1`: Cross-platform PowerShell build script (supports Windows, macOS, Linux)
- `t.sh`: Quick test build script

### Using PowerShell Build Script

```powershell
# Basic build
.\build.ps1

# Clean and rebuild
.\build.ps1 -Clean

# Show help
.\build.ps1 -Help
```

## ⚙️ Configuration Options

JSPrettify uses Prettier as the formatting engine and supports the following configuration options:

- **parser**: JavaScript parser (default: babel)
- **tabWidth**: Indent width (default: 2)
- **semi**: Whether to add semicolons (default: true)
- **singleQuote**: Whether to use single quotes (default: true)
- **trailingComma**: Trailing comma for object properties (default: none)

## 🧪 Testing

Run tests to verify that the build is successful:

```bash
# Unix/Linux/macOS
npm test
./dist/jsprettify test_data/test.min.js test_output.js

# Windows (PowerShell)
npm test
node dist/jsprettify test_data/test.min.js test_output.js
```

## 📄 Command Line Arguments

- `input.js`: Input JavaScript file path
- `output.js`: Output formatted file path (optional, defaults to stdout)

## 🔗 Related Resources

- [Prettier](https://prettier.io/): Code formatting tool
- [Node.js](https://nodejs.org/): JavaScript runtime environment
- [GitHub Repository](https://github.com/tekintian/jsprettify): Project source code

## 🤝 Contributing

Welcome to submit Issues and Pull Requests to improve JSPrettify!

## 📄 License

MIT License

---

**Author**: tekintian  
**Email**: tekintian@gmail.com  
**Website**: https://dev.tekin.cn  
**GitHub**: https://github.com/tekintian/jsprettify