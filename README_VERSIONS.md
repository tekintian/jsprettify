# JSPrettify 版本说明

## 📦 两个版本

### Lite 版本 (`index-lite.js`) ⭐ 推荐

**特点：**
- ✅ 轻量级，打包后约 15MB
- ✅ 不依赖 Chrome/Chromium
- ✅ 使用 Prettier 作为格式化引擎
- ✅ 启动速度快
- ✅ 适合 CI/CD 和服务器环境

**格式化方式：**
- 主要使用 Prettier（babel parser）
- 备用简单格式化方案

**适用场景：**
- 常规 JavaScript 代码格式化
- 需要快速分发和部署
- CI/CD 流水线
- 无浏览器环境

---

### Full 版本 (`index-full.js`)

**特点：**
- ✅ 使用 Chrome DevTools Protocol
- ✅ 格式化效果与 Chrome DevTools 一致
- ✅ 支持更复杂的格式化场景
- ⚠️ 打包后约 25MB
- ⚠️ 需要目标系统安装 Chrome/Chromium

**格式化方式：**
- 首选：Chrome DevTools Protocol (通过 CDP)
- 备用：Prettier

**适用场景：**
- 需要与 Chrome DevTools 完全一致的格式化效果
- 有 Chrome 环境的开发机器
- 特定的格式化需求

---

## 🔄 版本对比

| 特性 | Lite 版本 | Full 版本 |
|------|----------|-----------|
| 大小 | ~15MB | ~25MB |
| 依赖 | 仅 Prettier | Chrome + CDP |
| 启动速度 | 快 | 中等 |
| 格式化效果 | Prettier 标准 | Chrome DevTools |
| CI/CD 友好 | ✅ 是 | ❌ 否 |
| 离线使用 | ✅ 是 | ⚠️ 需 Chrome |

---

## 🚀 快速开始

### 使用 Lite 版本（推荐）

```bash
# 直接运行
npm run prettify bg.min.js

# 或打包后使用
./build.sh
./dist/jsprettify-lite-macos bg.min.js
```

### 使用 Full 版本

```bash
# 首先需要 Chrome（系统已安装的情况下）
./dist/jsprettify-full-macos bg.min.js
```

---

## 💡 选择建议

**选择 Lite 版本，如果：**
- 只是常规代码格式化
- 需要在服务器/CI 环境使用
- 希望快速、轻量
- 不想关心 Chrome 安装

**选择 Full 版本，如果：**
- 需要与 Chrome DevTools 完全一致的格式化效果
- 有特定格式化需求（如某些 Chrome 特有的处理）
- 在开发环境中使用，且有 Chrome

---

## 📋 打包命令

```bash
# 仅打包 Lite 版本（推荐）
npm run build:lite

# 仅打包 Full 版本
npm run build:full

# 打包所有版本
./build.sh
```

---

## 🎯 使用示例

```bash
# Lite 版本
./dist/jsprettify-lite-macos input.min.js output.js

# Full 版本
./dist/jsprettify-full-macos input.min.js output.js

# 指定输出文件
./dist/jsprettify-lite-macos bg.min.js prettified/bg.js
```

---

## 📝 常见问题

**Q: 为什么推荐 Lite 版本？**
A: Lite 版本体积小、无依赖、更易分发，对大部分场景已经足够。

**Q: Full 版本的格式化效果有什么不同？**
A: Full 版本使用 Chrome DevTools Protocol，格式化效果与 Chrome DevTools 面板一致。

**Q: 可以在 CI/CD 中使用 Full 版本吗？**
A: 不推荐，因为需要安装 Chrome，会增加构建复杂度和镜像大小。

**Q: 两个版本可以同时存在吗？**
A: 可以，它们是独立的可执行文件，互不冲突。
