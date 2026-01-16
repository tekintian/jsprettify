# JSPrettify - JavaScript 代码美化与解压工具

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**JSPrettify** 是一个强大的 JavaScript 代码处理工具，能够解压、格式化和美化压缩/混淆的 JavaScript 代码。它基于 Prettier 构建，支持将复杂的压缩代码转换为可读性强的标准格式。

## ✨ 特性

- 🚀 **快速解压**：将压缩/混淆的 JavaScript 代码解压为可读格式
- 🎨 **智能格式化**：基于 Prettier 的高质量代码格式化
- 📦 **跨平台支持**：支持 macOS、Linux、Windows 多平台
- 🔧 **零依赖可执行文件**：使用 `pkg` 打包成独立可执行文件，无需 Node.js 环境
- ⚡ **高效处理**：优化的处理流程，快速处理大型文件
- ✅ **语法验证**：自动验证输出代码的语法正确性

## 📦 安装

### 方式一：使用 npm（需要 Node.js 环境）

```bash
npm install -g jsprettify
```

### 方式二：使用预编译可执行文件

从 [GitHub Releases](https://github.com/tekintian/jsprettify/releases) 下载对应平台的可执行文件：

- **macOS (Intel)**: `jsprettify-macos-x64`
- **macOS (Apple Silicon)**: `jsprettify-macos-arm64`
- **Linux**: `jsprettify-linux-x64`
- **Windows**: `jsprettify-win-x64.exe`

下载后赋予执行权限（Linux/macOS）：

```bash
chmod +x jsprettify-*
```

### 方式三：从源码构建

```bash
git clone https://github.com/tekintian/jsprettify.git
cd jsprettify
npm install
```

## 🚀 使用方式

### 基本用法

```bash
# 使用 npm 安装的方式
jsprettify input.min.js output.js

# 或使用可执行文件
./jsprettify-macos-x64 input.min.js output.js
```

### 命令行参数

```bash
jsprettify <input.js> [output.js]

# 参数说明：
#   input.js   - 必需，输入的压缩 JavaScript 文件
#   output.js  - 可选，输出的格式化文件（默认为 input_prettified.js）
```

### 示例

```bash
# 示例 1：基本使用
jsprettify bg.min.js
# 输出：bg_prettified.js

# 示例 2：指定输出文件名
jsprettify bg.min.js beautified.js

# 示例 3：使用不同平台的可执行文件
./dist/jsprettify-macos-x64 bg.min.js bg_beautiful.js
```

### 实际效果

**输入**（压缩代码，约 40 行）：
```javascript
var h=!1,q=RegExp("^bytes [0-9]+-[0-9]+/([0-9]+)$"),w="object xmlhttprequest media other main_frame sub_frame image".split(" "),z=["object","xmlhttprequest","media","other"],A=RegExp("://.+/([^/]+?(?:.([^./]+?))?)(?=[?#]|$)"),aa=[301,302,303,307,308],ba=RegExp("^(?:application/x-apple-diskimage|application/download|application/force-download|application/x-msdownload|binary/octet-stream)$","i"),B=RegExp("^(?:FLV|SWF|MP3|MP4|M4V|F4F|F4V|M4A|MPG|MPEG|MPEG4|MPE|AVI|WMV|WMA|WAV|WAVE|ASF|RM|RAM|OGG|OGV|OGM|OGA|MOV|MID|MIDI|3GP|3GPP|QT|WEBM|TS|MKV|AAC|MP2T|MPEGTS|RMVB|VTT|SRT)$","i"),ca=RegExp("^(?:HTM|HTML|MHT|MHTML|SHTML|SHTM|XHT|XHTM|XHTML|XML|TXT|CSS|JS|JSON|GIF|ICO|JPEG|JPG|PNG|WEBP|BMP|SVG|TIF|TIFF|PDF|PHP|ASP|ASPX|EOT|TTF|WOF|WOFF|WOFF2|MSG|PEM|BR|OTF|ACZ|AZC|CGI|TPL|OSD|M3U8|DO|DICT)$","i"),da=RegExp("^(?:FLV|AVI|MPG|MPE|WMV|QT|MOV|RM|RAM|WMA|MID|MIDI|AAC|MKV|RMVB)$","i"),C=RegExp("^(?:F4F|MPEGTS|TS|MP2T)$","i"),E={"application/x-apple-diskimage":"DMG","application/cert-chain+cbor":"MSG","application/epub+zip":"EPUB","application/java-archive":"JAR","video/x-matroska":"MKV","text/html":"HTML|HTM","text/css":"CSS","text/javascript":"JS|JSON","text/mspg-legacyinfo":"MSI|MSP","text/plain":"TXT|SRT","text/srt":"SRT","text/vtt":"VTT|SRT","text/xml":"XML|F4M|TTML","text/x-javascript":"JS|JSON","text/x-json":"JSON","application/f4m+xml":"F4M","application/gzip":"GZ","application/javascript":"JS","application/json":"JSON","application/msword":"DOC|DOCX|DOT|DOTX","application/pdf":"PDF","application/ttaf+xml":"DFXP","application/vnd.apple.mpegurl":"M3U8","application/zip":"ZIP","application/x-7z-compressed":"7Z","application/x-aim":"PLJ","application/x-compress":"Z","application/x-compress-7z":"7Z","application/x-compressed":"ARJ","application/x-gtar":"TAR","application/x-msi":"MSI","application/x-msp":"MSP","application/x-gzip":"GZ","application/x-gzip-compressed":"GZ","application/x-javascript":"JS","application/x-mpegurl":"M3U8","application/x-msdos-program":"EXE|DLL","application/vnd.apple.installer+xml":"MPKG","application/x-ole-storage":"MSI|MSP","application/x-rar":"RAR","application/x-rar-compressed":"RAR","application/x-sdlc":"EXE|SDLC","application/x-shockwave-flash":"SWF","application/x-silverlight-app":"XAP","application/x-subrip":"SRT","application/x-tar":"TAR","application/x-zip":"ZIP","application/x-zip-compressed":"ZIP","video/3gpp":"3GP|3GPP","video/3gpp2":"3GP|3GPP","video/avi":"AVI","video/f4f":"F4F","video/f4m":"F4M","video/flv":"FLV","video/mp2t":"TS|M3U8","video/mp4":"MP4|M4V","video/mpeg":"MPG|MPEG|MPE","video/mpegurl":"M3U8|M3U","video/mpg4":"MP4|M4V","video/msvideo":"AVI","video/quicktime":"MOV|QT","video/webm":"WEBM","video/x-flash-video":"FLV","video/x-flv":"FLV","video/x-mp4":"MP4|M4V","video/x-mpegurl":"M3U8|M3U","video/x-mpg4":"MP4|M4V","video/x-ms-asf":"ASF","video/x-ms-wmv":"WMV","video/x-msvideo":"AVI","audio/3gpp":"3GP|3GPP","audio/3gpp2":"3GP|3GPP","audio/mp3":"MP3","audio/mp4":"M4A|MP4","audio/mp4a-latm":"M4A|MP4","audio/mpeg":"MP3","audio/mpeg4-generic":"M4A|MP4","audio/mpegurl":"M3U8|M3U","image/svg+xml":"SVG|SVGZ","audio/webm":"WEBM","audio/wav":"WAV","audio/x-mpeg":"MP3","audio/x-mpegurl":"M3U8|M3U","audio/x-ms-wma":"WMA","audio/x-wav":"WAV","ilm/tm":"MP3","image/gif":"GIF|GFA","image/icon":"ICO|CUR","image/jpg":"JPG|JPEG","image/jpeg":"JPG|JPEG","image/png":"PNG|APNG","image/tiff":"TIF|TIFF","image/vnd.microsoft.icon":"ICO|CUR","image/webp":"WEBP","image/x-icon":"ICO|CUR","flv-application/octet-stream":"FLV","image/x-xbitmap":"XBM","audio/x-mp3":"MP3","audio/x-hx-aac-adts":"AAC","audio/aac":"AAC","audio/x-aac":"AAC","application/vnd.rn-realmedia-vbr":"RMVB"};
```

**输出**（格式化后的代码，约 800+ 行）：
```javascript
var h = !1,
    q = RegExp("^bytes [0-9]+-[0-9]+/([0-9]+)$"),
    w = "object xmlhttprequest media other main_frame sub_frame image".split(" "),
    z = [
        "object",
        "xmlhttprequest",
        "media",
        "other"
    ],
    A = RegExp("://.+/([^/]+?(?:.([^./]+?))?)(?=[?#]|$)"),
    aa = [
        301,
        302,
        303,
        307,
        308
    ],
    // ... 更多格式化后的代码
```

## 🛠️ 构建与开发

### 环境要求

- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器

### 开发步骤

1. **克隆项目**

```bash
git clone https://github.com/tekintian/jsprettify.git
cd jsprettify
```

2. **安装依赖**

```bash
npm install
```

3. **运行测试**

```bash
# 测试格式化功能
npm run prettify -- test_data/test.min.js output.js

# 或直接运行
node src/index.js test_data/test.min.js output.js
```

4. **构建可执行文件**

```bash
# 构建当前平台版本
npm run build

# 构建所有平台版本
npm run build:all
```

### 构建脚本说明

- **`build.sh`**: 构建所有平台的可执行文件
- **`t.sh`**: 测试脚本，验证功能和构建结果

### 手动打包

如果使用 `pkg` 手动打包：

```bash
# 安装 pkg（如果未安装）
npm install -g pkg

# 打包当前平台
pkg src/index.js --output jsprettify

# 打包指定平台
pkg src/index.js --targets node18-macos-x64 --output jsprettify-macos
```

## 📂 项目结构

```
jsprettify/
├── src/
│   └── index.js          # 主程序源码
├── test_data/
│   └── test.min.js       # 测试用压缩代码
├── dist/                 # 构建输出的可执行文件
├── build.sh              # 全平台构建脚本
├── t.sh                  # 测试脚本
├── package.json          # 项目配置
└── README.md            # 本文档
```

## 🔧 技术原理

JSPrettify 的工作原理：

1. **输入处理**：读取压缩的 JavaScript 文件
2. **语法解析**：使用 Prettier 的 Babel 解析器解析代码
3. **AST 转换**：将代码转换为抽象语法树（AST）
4. **代码生成**：根据 AST 生成格式化后的代码
5. **语法验证**：使用 Node.js 验证输出代码的语法正确性

### 核心依赖

- **[Prettier](https://prettier.io/)**: 代码格式化引擎
- **[Babel Parser](https://babeljs.io/docs/en/babel-parser)**: JavaScript 语法解析
- **[pkg](https://github.com/vercel/pkg)**: 将 Node.js 应用打包为可执行文件

## 📋 命令汇总

```bash
# 安装依赖
npm install

# 运行格式化
node src/index.js input.min.js output.js

# 构建当前平台可执行文件
npm run build

# 构建所有平台可执行文件
npm run build:all

# 运行测试
bash t.sh
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发规范

1. 使用 ESLint 进行代码规范检查
2. 提交前确保所有测试通过
3. 更新文档以反映任何变更

## 📝 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 🔗 相关链接

- [Prettier 官方文档](https://prettier.io/docs/en/)
- [Babel Parser](https://babeljs.io/docs/en/babel-parser)
- [专业软件定制开发](https://dev.tekin.cn)

## 💡 常见问题

### Q: 输出的代码行数比预期少？

A: 某些高度混淆的代码可能需要 Chrome DevTools 的 V8 引擎才能完全解压。本工具使用 Prettier 进行格式化，对于极端情况建议使用 Chrome 开发者工具的 "Pretty Print" 功能。

### Q: 打包后的可执行文件很大？

A: 这是因为 `pkg` 会将 Node.js 运行时和所有依赖打包进单个文件。这是为了实现在没有 Node.js 环境的机器上运行。

### Q: 支持哪些 JavaScript 版本？

A: 支持 ES5、ES6/ES2015 及更新的 JavaScript 版本，包括 async/await、箭头函数等现代特性。

## 📞 支持

如有问题或建议，请通过以下方式联系：

- 提交 [GitHub Issue](https://github.com/tekintian/jsprettify/issues)
- 发送邮件至：tekintian@gmail.com
- 微信：tekintian 
- QQ: 932256355

---

**Happy Coding!** 🎉
