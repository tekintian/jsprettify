# GitHub Actions CI/CD 使用指南

## 🚀 工作流说明

### 1. **Build and Release** (`.github/workflows/build.yml`)
自动构建并发布跨平台可执行文件。

**触发条件：**
- 推送标签 `v*` (如 `v1.0.0`)
- 手动触发 (Workflow Dispatch)

**构建产物：**
- `jsprettify-lite-linux-x64` - Linux Lite 版本
- `jsprettify-lite-macos-arm64` - macOS ARM64 Lite 版本（Apple Silicon）
- `jsprettify-lite-macos-x64` - macOS x64 Lite 版本（Intel）
- `jsprettify-lite-win-x64.exe` - Windows Lite 版本
- `jsprettify-full-linux-x64` - Linux Full 版本
- `jsprettify-full-macos-arm64` - macOS ARM64 Full 版本
- `jsprettify-full-macos-x64` - macOS x64 Full 版本
- `jsprettify-full-win-x64.exe` - Windows Full 版本

**发布格式：**
- `jsprettify-linux-x64.tar.gz` - Linux 压缩包
- `jsprettify-macos-arm64.tar.gz` - macOS ARM64 压缩包
- `jsprettify-macos-x64.tar.gz` - macOS x64 压缩包
- `jsprettify-win-x64.zip` - Windows 压缩包
- `checksums.txt` - MD5 校验和
- `sha256sums.txt` - SHA256 校验和

---

### 2. **Test** (`.github/workflows/test.yml`)
运行测试确保代码正确性。

**触发条件：**
- 推送到 `main` 或 `develop` 分支
- Pull Request

**测试内容：**
- 执行格式化功能
- 验证输出文件
- 语法检查
- 对比不同版本输出

---

### 3. **Lint** (`.github/workflows/lint.yml`)
代码检查和语法验证。

**触发条件：**
- 推送到 `main` 或 `develop` 分支
- Pull Request

**检查内容：**
- Node.js 语法检查
- 文件可执行权限

---

## 📦 发布流程

### 方式 1：标签触发（推荐）

```bash
# 1. 提交代码
git add .
git commit -m "Release v1.0.0"
git push

# 2. 创建标签并推送
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions 会自动：
1. 构建所有平台的可执行文件
2. 创建 GitHub Release
3. 上传所有产物到 Release 页面

### 方式 2：手动触发

1. 进入 GitHub 仓库
2. 点击 **Actions** 标签
3. 选择 **Build and Release** 工作流
4. 点击 **Run workflow**
5. 勾选 **Create GitHub Release**
6. 点击 **Run workflow**

---

## 📥 下载使用

### 从 Release 页面下载

1. 访问仓库的 **Releases** 页面
2. 选择最新版本
3. 下载对应平台的文件：
   - **Linux**: `jsprettify-linux-x64.tar.gz`
   - **macOS (Apple Silicon)**: `jsprettify-macos-arm64.tar.gz`
   - **macOS (Intel)**: `jsprettify-macos-x64.tar.gz`
   - **Windows**: `jsprettify-win-x64.zip`

### 如何选择 macOS 版本？

在终端运行以下命令查看您的 Mac 架构：

```bash
uname -m
```

- 输出 `arm64`: 使用 `jsprettify-macos-arm64`
- 输出 `x86_64`: 使用 `jsprettify-macos-x64`

### 验证完整性

```bash
# 下载校验和文件
wget https://github.com/username/jsprettify/releases/download/v1.0.0/sha256sums.txt

# 验证
sha256sum -c sha256sums.txt
```

---

## 🔍 工作流状态

在仓库首页可以看到所有工作流的状态徽章：

```markdown
[![Build Status](https://github.com/username/jsprettify/workflows/Build%20and%20Release/badge.svg)](https://github.com/username/jsprettify/actions)
[![Test Status](https://github.com/username/jsprettify/workflows/Test/badge.svg)](https://github.com/username/jsprettify/actions)
[![Lint Status](https://github.com/username/jsprettify/workflows/Lint/badge.svg)](https://github.com/username/jsprettify/actions)
```

---

## 📝 版本管理

### 语义化版本

推荐使用语义化版本号：

- `v1.0.0` - 主要版本
- `v1.1.0` - 次要版本（新功能）
- `v1.1.1` - 补丁版本（bug 修复）

### 预发布版本

- `v1.0.0-alpha.1`
- `v1.0.0-beta.1`
- `v1.0.0-rc.1`

### 更新 CHANGELOG

每次发布时，GitHub Actions 会自动生成 release notes，包含：

- 相关的 commits
- Pull Requests
- Contributors

---

## 🛠️ 本地构建（替代 CI）

如果需要本地构建：

```bash
# 构建所有版本
./build.sh

# 仅构建 Lite 版本
npm run build:lite

# 仅构建 Full 版本
npm run build:full

# 仅构建 macOS ARM64 版本
npm run build:mac-arm64

# 仅构建 macOS x64 版本
npm run build:mac-x64

# 仅构建 Linux 版本
npm run build:linux

# 仅构建 Windows 版本
npm run build:win
```

---

## ⚡ 性能优化

Lite 版本使用 `--no-bytecode --public` 参数优化：

- **无 bytecode**: 减少 10-15MB
- **public 模式**: 减少依赖检测开销
- **预期体积**: ~15MB

---

## 🐛 故障排查

### 构建失败

1. 检查 Actions 日志
2. 确认 `package.json` 配置正确
3. 验证依赖项完整

### 发布失败

1. 确认有创建 Release 的权限
2. 检查 GITHUB_TOKEN 权限
3. 验证标签格式正确

### 文件体积异常

- Lite 版本应在 15MB 左右
- Full 版本应在 25MB 左右
- 如果异常，检查是否包含了不需要的依赖

---

## 📚 更多资源

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [pkg 打包工具文档](https://github.com/vercel/pkg)
- [语义化版本规范](https://semver.org/lang/zh-CN/)
