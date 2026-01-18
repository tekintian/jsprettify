# JSPrettify - JavaScript Code Beautification and Decompression Tool

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**JSPrettify** is a powerful JavaScript code processing tool that can decompress, format, and beautify compressed/obfuscated JavaScript code. Built on Prettier, it supports converting complex compressed code into readable standard format.

[简体中文版本](README_CN.md)

## ✨ Features

- 🚀 **Fast Decompression**: Decompress compressed/obfuscated JavaScript code into readable format
- 🎨 **Intelligent Formatting**: High-quality code formatting based on Prettier
- 📦 **Cross-platform Support**: Supports macOS, Linux, Windows multi-platform
- ⚡ **Efficient Processing**: Optimized processing flow for quick handling of large files
- ✅ **Syntax Validation**: Automatically validates syntax correctness of output code
- 🔥 **Multiple Packaging Solutions**: Provides three different packaging branches to meet various needs

## 🌿 Project Branches

This project provides three different branches, each using different packaging technologies:

### 1. main branch (ncc packaging)
- **Packaging Tool**: `@vercel/ncc`
- **Node.js Version Requirement**: >= 16.0.0
- **Features**: Packages the entire project into a single JavaScript file with smaller size, suitable for module usage
- **Use Case**: Ideal for integration into other Node.js projects

### 2. pkg branch (pkg packaging)
- **Packaging Tool**: `pkg` (version 2.8.8)
- **Node.js Version Requirement**: No specific requirement (runtime built-in)
- **Features**: Packages into standalone executable files, runnable without Node.js environment
- **Use Case**: Suitable for distribution to users without Node.js environments

### 3. sea branch (Node.js native packaging)
- **Packaging Tool**: Node.js native SEA (Single Executable Application)
- **Node.js Version Requirement**: >= 20.0.0
- **Features**: Creates single executable files using Node.js native features with better performance
- **Use Case**: Ideal for users pursuing ultimate performance and native experience

## 📦 Installation

### Method 1: Using npm (for main branch)

```bash
npm install -g jsprettify
```

### Method 2: Using Pre-built Executables

Based on your chosen branch, download corresponding platform executables from [GitHub Releases](https://github.com/tekintian/jsprettify/releases):

#### pkg branch versions
- **macOS (Intel)**: `jsprettify-pkg-macos-x64`
- **macOS (Apple Silicon)**: `jsprettify-pkg-macos-arm64`
- **Linux**: `jsprettify-pkg-linux-x64`
- **Windows**: `jsprettify-pkg-win-x64.exe`

#### SEA branch versions
- **macOS (Intel)**: `jsprettify-sea-macos-x64`
- **macOS (Apple Silicon)**: `jsprettify-sea-macos-arm64`
- **Linux**: `jsprettify-sea-linux-x64`
- **Windows**: `jsprettify-sea-win-x64.exe`

Make executable files (Linux/macOS):

```bash
chmod +x jsprettify-*
```

### Method 3: Building from Source

Based on the branch you want to use, switch to the corresponding branch:

```bash
# Clone project
git clone https://github.com/tekintian/jsprettify.git
cd jsprettify

# Switch to desired branch
git checkout main      # ncc packaging branch
# or
git checkout pkg       # pkg packaging branch
# or
git checkout sea       # sea packaging branch

# Install dependencies
npm install
```

## 🚀 Usage

### Basic Usage

```bash
# Using npm installation (main branch)
jsprettify input.min.js output.js

# Or using executable files (pkg/sea branches)
./jsprettify-pkg-macos-x64 input.min.js output.js
./jsprettify-sea-macos-x64 input.min.js output.js
```

### Command-line Arguments

```bash
jsprettify <input.js> [output.js]

# Arguments:
#   input.js   - Required, input compressed JavaScript file
#   output.js  - Optional, output formatted file (defaults to input_prettified.js)
```

### Examples

```bash
# Example 1: Basic usage (main branch)
jsprettify bg.min.js
# Output: bg_prettified.js

# Example 2: Specify output filename (main branch)
jsprettify bg.min.js beautified.js

# Example 3: Using executables on different platforms (pkg/sea branches)
./dist/jsprettify-pkg-macos-x64 bg.min.js bg_beautiful.js
./dist/jsprettify-sea-macos-x64 bg.min.js bg_beautiful.js
```

### Actual Effect

**Input** (compressed code, ~40 lines):
```javascript
var h=!1,q=RegExp("^bytes [0-9]+-[0-9]+/([0-9]+)$"),w="object xmlhttprequest media other main_frame sub_frame image".split(" "),z=["object","xmlhttprequest","media","other"],A=RegExp("://.+/([^/]+?(?:.([^./]+?))?)(?=[?#]|$)"),aa=[301,302,303,307,308],ba=RegExp("^(?:application/x-apple-diskimage|application/download|application/force-download|application/x-msdownload|binary/octet-stream)$","i"),B=RegExp("^(?:FLV|SWF|MP3|MP4|M4V|F4F|F4V|M4A|MPG|MPEG|MPEG4|MPE|AVI|WMV|WMA|WAV|WAVE|ASF|RM|RAM|OGG|OGV|OGM|OGA|MOV|MID|MIDI|3GP|3GPP|QT|WEBM|TS|MKV|AAC|MP2T|MPEGTS|RMVB|VTT|SRT)$","i"),ca=RegExp("^(?:HTM|HTML|MHT|MHTML|SHTML|SHTM|XHT|XHTM|XHTML|XML|TXT|CSS|JS|JSON|GIF|ICO|JPEG|JPG|PNG|WEBP|BMP|SVG|TIF|TIFF|PDF|PHP|ASP|ASPX|EOT|TTF|WOF|WOFF|WOFF2|MSG|PEM|BR|OTF|ACZ|AZC|CGI|TPL|OSD|M3U8|DO|DICT)$","i"),da=RegExp("^(?:FLV|AVI|MPG|MPE|WMV|QT|MOV|RM|RAM|WMA|MID|MIDI|AAC|MKV|RMVB)$","i"),C=RegExp("^(?:F4F|MPEGTS|TS|MP2T)$","i"),E={"application/x-apple-diskimage":"DMG","application/cert-chain+cbor":"MSG","application/epub+zip":"EPUB","application/java-archive":"JAR","video/x-matroska":"MKV","text/html":"HTML|HTM","text/css":"CSS","text/javascript":"JS|JSON","text/mspg-legacyinfo":"MSI|MSP","text/plain":"TXT|SRT","text/srt":"SRT","text/vtt":"VTT|SRT","text/xml":"XML|F4M|TTML","text/x-javascript":"JS|JSON","text/x-json":"JSON","application/f4m+xml":"F4M","application/gzip":"GZ","application/javascript":"JS","application/json":"JSON","application/msword":"DOC|DOCX|DOT|DOTX","application/pdf":"PDF","application/ttaf+xml":"DFXP","application/vnd.apple.mpegurl":"M3U8","application/zip":"ZIP","application/x-7z-compressed":"7Z","application/x-aim":"PLJ","application/x-compress":"Z","application/x-compress-7z":"7Z","application/x-compressed":"ARJ","application/x-gtar":"TAR","application/x-msi":"MSI","application/x-msp":"MSP","application/x-gzip":"GZ","application/x-gzip-compressed":"GZ","application/x-javascript":"JS","application/x-mpegurl":"M3U8","application/x-msdos-program":"EXE|DLL","application/vnd.apple.installer+xml":"MPKG","application/x-ole-storage":"MSI|MSP","application/x-rar":"RAR","application/x-rar-compressed":"RAR","application/x-sdlc":"EXE|SDLC","application/x-shockwave-flash":"SWF","application/x-silverlight-app":"XAP","application/x-subrip":"SRT","application/x-tar":"TAR","application/x-zip":"ZIP","application/x-zip-compressed":"ZIP","video/3gpp":"3GP|3GPP","video/3gpp2":"3GP|3GPP","video/avi":"AVI","video/f4f":"F4F","video/f4m":"F4M","video/flv":"FLV","video/mp2t":"TS|M3U8","video/mp4":"MP4|M4V","video/mpeg":"MPG|MPEG|MPE","video/mpegurl":"M3U8|M3U","video/mpg4":"MP4|M4V","video/msvideo":"AVI","video/quicktime":"MOV|QT","video/webm":"WEBM","video/x-flash-video":"FLV","video/x-flv":"FLV","video/x-mp4":"MP4|M4V","video/x-mpegurl":"M3U8|M3U","video/x-mpg4":"MP4|M4V","video/x-ms-asf":"ASF","video/x-ms-wmv":"WMV","video/x-msvideo":"AVI","audio/3gpp":"3GP|3GPP","audio/3gpp2":"3GP|3GPP","audio/mp3":"MP3","audio/mp4":"M4A|MP4","audio/mp4a-latm":"M4A|MP4","audio/mpeg":"MP3","audio/mpeg4-generic":"M4A|MP4","audio/mpegurl":"M3U8|M3U","image/svg+xml":"SVG|SVGZ","audio/webm":"WEBM","audio/wav":"WAV","audio/x-mpeg":"MP3","audio/x-mpegurl":"M3U8|M3U","audio/x-ms-wma":"WMA","audio/x-wav":"WAV","ilm/tm":"MP3","image/gif":"GIF|GFA","image/icon":"ICO|CUR","image/jpg":"JPG|JPEG","image/jpeg":"JPG|JPEG","image/png":"PNG|APNG","image/tiff":"TIF|TIFF","image/vnd.microsoft.icon":"ICO|CUR","image/webp":"WEBP","image/x-icon":"ICO|CUR","flv-application/octet-stream":"FLV","image/x-xbitmap":"XBM","audio/x-mp3":"MP3","audio/x-hx-aac-adts":"AAC","audio/aac":"AAC","audio/x-aac":"AAC","application/vnd.rn-realmedia-vbr":"RMVB"};
```

**Output** (formatted code, ~800+ lines):
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
    // ... more formatted code
```

## 🛠️ Development and Building

### Environment Requirements (by branch)

- **main branch**: Node.js 16.0 or higher
- **pkg branch**: Any Node.js version (no dependency after packaging)
- **sea branch**: Node.js 20.0 or higher

### Development Steps

1. **Clone project and switch branch**

```bash
git clone https://github.com/tekintian/jsprettify.git
cd jsprettify

# Switch to desired branch
git checkout main  # or pkg or sea
```

2. **Install dependencies**

```bash
npm install
```

3. **Run tests**

```bash
# Test formatting functionality
npm run prettify -- test_data/test.min.js output.js

# Or run directly
node src/index.js test_data/test.min.js output.js
```

4. **Build executables**

```bash
# main branch - Build ncc version
npm run build

# pkg branch - Build pkg version
npm run build:pkg  # Requires pkg-related script configuration

# sea branch - Build SEA version
npm run build:sea  # Requires SEA-related script configuration
```

### Build Script Information

- **`build.sh`**: Builds executables for all platforms
- **`t.sh`**: Test script to verify functionality and build results

### Manual Packaging

**main branch (ncc)**:

```bash
# Install ncc (if not installed)
npm install -g @vercel/ncc

# Build
npx @vercel/ncc build src/index.js -o dist --minify
```

**pkg branch (pkg)**:

```bash
# Install pkg (if not installed)
npm install -g pkg

# Package current platform
pkg src/index.js --output jsprettify

# Package specific platform
pkg src/index.js --targets node18-macos-x64 --output jsprettify-macos
```

**sea branch (Node.js SEA)**:

```bash
# Build application bundle
npm run build:bundle  # Bundle application into single JS file

# Create executable using Node.js SEA
node --experimental-sea-config sea-config.json
npx postject jsprettify.bin NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc46ae8
```

## 📂 Project Structure

```
jsprettify/
├── src/
│   └── index.js          # Main program source
├── test_data/
│   └── test.min.js       # Compressed code for testing
├── dist/                 # Built executable files
├── build.sh              # Cross-platform build script
├── t.sh                  # Test script
├── package.json          # Project configuration
└── README.md             # Documentation
```

## 🔧 Technical Principles

How JSPrettify works:

1. **Input Processing**: Read compressed JavaScript files
2. **Syntax Parsing**: Parse code using Prettier's Babel parser
3. **AST Conversion**: Convert code to Abstract Syntax Tree (AST)
4. **Code Generation**: Generate formatted code based on AST
5. **Syntax Validation**: Validate syntax correctness using Node.js

### Core Dependencies

- **[Prettier](https://prettier.io/)**: Code formatting engine
- **[Babel Parser](https://babeljs.io/docs/en/babel-parser)**: JavaScript syntax parsing
- **[pkg](https://github.com/vercel/pkg)**: Package Node.js apps as executables (pkg branch)
- **[@vercel/ncc](https://github.com/vercel/ncc)**: Package Node.js apps as single files (main branch)
- **[Node.js SEA](https://nodejs.org/api/single-executable-applications.html)**: Single executable applications (sea branch)

## 📋 Command Summary

```bash
# Install dependencies
npm install

# Run formatting
node src/index.js input.min.js output.js

# main branch - Build current platform executable
npm run build

# Run tests
bash t.sh
```

## 🤝 Contributing

Welcome to submit Issues and Pull Requests!

### Development Guidelines

1. Use ESLint for code style checking
2. Ensure all tests pass before committing
3. Update documentation to reflect any changes

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 👨‍💻 About the Author

- **Author**: TekinTian
- **Email**: tekintian@gmail.com
- **Website**: https://dev.tekin.cn
- **Professional Services**: We provide professional custom software development services. If you have any software development needs, please contact us through the above methods.

## 🔗 Related Links

- [Prettier Official Documentation](https://prettier.io/docs/en/)
- [Babel Parser](https://babeljs.io/docs/en/babel-parser)
- [Professional Custom Software Development](https://dev.tekin.cn)

## 💡 Frequently Asked Questions

### Q: Output code has fewer lines than expected?

A: Some highly obfuscated code may require Chrome DevTools' V8 engine for complete decompression. This tool uses Prettier for formatting, and for extreme cases, consider using Chrome DevTools' "Pretty Print" feature.

### Q: Different branch executable sizes vary greatly?

A:
- **main (ncc)**: Smallest size, but requires Node.js environment
- **pkg**: Larger size, but runs independently without Node.js
- **sea**: Moderate size, optimal performance, requires Node.js 20+

### Q: What JavaScript versions are supported?

A: Supports ES5, ES6/ES2015, and newer JavaScript versions, including modern features like async/await and arrow functions.

## 📞 Support

For issues or suggestions, please contact us via:

- Submit [GitHub Issue](https://github.com/tekintian/jsprettify/issues)
- Email: tekintian@gmail.com
- Visit website: https://dev.tekin.cn

---

**Happy Coding!** 🎉