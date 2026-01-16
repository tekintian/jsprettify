# JSPrettify 版本说明

## 📦 两个版本

### Lite 版本 (`index-lite.js`) - 使用系统 Chrome

**特点：**
- ✅ 调用系统安装的 Chrome/Chromium 浏览器
- ✅ 使用 Chrome DevTools Protocol 格式化
- ✅ 格式化效果与 Chrome DevTools 一致
- ⚠️ 打包后约 25MB
- ⚠️ 需要目标系统安装 Chrome/Chromium

**格式化方式：**
- 首选：Chrome DevTools Protocol (通过系统 Chrome)
- 备用：Prettier

**适用场景：**
- 开发环境（通常已安装 Chrome）
- 需要与 Chrome DevTools 完全一致的格式化效果
- 个人电脑使用

---

### Full 版本 (`index-full.js`) - 完全独立 ⭐ 推荐

**特点：**
- ✅ 轻量级，打包后约 15MB
- ✅ 完全独立，不依赖任何外部工具
- ✅ 内置 Prettier 格式化引擎
- ✅ 启动速度快
- ✅ 适合 CI/CD 和服务器环境

**格式化方式：**
- 主要使用 Prettier（babel parser）
- 备用简单格式化方案

**适用场景：**
- CI/CD 流水线
- 服务器环境（无浏览器）
- 离线环境
- 快速分发和部署

---

## 🔄 版本对比

| 特性 | Lite 版本 | Full 版本 |
|------|----------|-----------|
| 大小 | ~25MB | ~15MB |
| 依赖 | 系统 Chrome | 无外部依赖 |
| 格式化效果 | Chrome DevTools | Prettier 标准 |
| 启动速度 | 中等（需启动 Chrome） | 快 |
| CI/CD 友好 | ❌ 需要安装 Chrome | ✅ 是 |
| 离线使用 | ⚠️ 需要安装 Chrome | ✅ 完全独立 |
| 完全可移植 | ❌ | ✅ |

---

## 🚀 快速开始

### 使用 Full 版本（推荐）

```bash
# 直接运行
./dist/jsprettify-full-macos bg.min.js

# 完全独立，无需任何依赖
```

### 使用 Lite 版本

```bash
# 需要系统安装 Chrome
./dist/jsprettify-lite-macos bg.min.js
```

---

## 💡 选择建议

**选择 Full 版本，如果：**
- CI/CD 环境（无浏览器）
- 服务器部署
- 离线环境使用
- 需要完全可移植
- 希望最小体积

**选择 Lite 版本，如果：**
- 开发环境（有 Chrome）
- 需要与 Chrome DevTools 一致的格式化
- 更复杂的格式化需求

---

## 📋 打包命令

```bash
# 仅打包 Full 版本（推荐）
npm run build:full

# 仅打包 Lite 版本
npm run build:lite

# 打包所有版本
./build.sh
```

---

## 🎯 使用示例

```bash
# Full 版本（推荐）
./dist/jsprettify-full-macos input.min.js output.js

# Lite 版本
./dist/jsprettify-lite-macos input.min.js output.js

# 指定输出文件
./dist/jsprettify-full-macos bg.min.js prettified/bg.js
```

---

## 📝 常见问题

**Q: 为什么推荐 Full 版本？**
A: Full 版本完全独立、体积小（15MB）、无任何依赖，适合大多数场景。

**Q: Lite 版本的格式化效果有什么不同？**
A: Lite 版本使用 Chrome DevTools Protocol，格式化效果与 Chrome DevTools 面板一致。

**Q: 可以在 CI/CD 中使用 Lite 版本吗？**
A: 不推荐，因为需要安装 Chrome，会增加构建复杂度和镜像大小。推荐使用 Full 版本。

**Q: 两个版本可以同时存在吗？**
A: 可以，它们是独立的可执行文件，互不冲突。
