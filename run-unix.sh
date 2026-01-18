#!/bin/bash

# Unix/Linux/macOS 运行脚本，用于运行或安装 JSPrettify
# Author: tekintian@gmail.com (https://dev.tekin.cn)
# Version: 1.0.0
# 说明：
# 此脚本用于运行或安装 JSPrettify。
# 可以在 Unix/Linux/macOS 中直接运行，也可以添加到系统 PATH 中作为全局命令。

# 确保脚本在 Unix/Linux/macOS 上运行
if [[ "$OSTYPE" != "linux-gnu"* && "$OSTYPE" != "darwin"* ]]; then
    echo "❌ 此脚本仅支持 Unix/Linux/macOS 系统"
    exit 1
fi

show_help() {
    echo "Usage: $0 [options] [input.js] [output.js]"
    echo ""
    echo "Options:"
    echo "  --install, -i     将 JSPrettify 安装到系统全局路径"
    echo "  --help, -h        显示此帮助信息"
    echo ""
    echo "Examples:"
    echo "  $0 test.min.js                    # 运行 JSPrettify 处理文件"
    echo "  $0 test.min.js output.js          # 指定输出文件"
    echo "  $0 --install                      # 全局安装 JSPrettify"
    echo ""
}

install_jsprettify() {
    echo "🔧 正在安装 JSPrettify..."
    
    # 检查是否有管理员权限
    if [ "$EUID" -ne 0 ]; then
        echo "⚠️  需要管理员权限来安装 JSPrettify"
        echo "💡 将使用 sudo 来请求权限"
        
        # 尝试将文件复制到系统路径
        if command -v sudo >/dev/null 2>&1; then
            # 优先级: /usr/local/bin > /opt/bin > /usr/bin
            if [ -w "/usr/local/bin" ]; then
                sudo cp dist/jsprettify /usr/local/bin/jsprettify
                echo "✅ JSPrettify 已安装到 /usr/local/bin/jsprettify"
            elif [ -w "/opt/bin" ]; then
                sudo cp dist/jsprettify /opt/bin/jsprettify
                echo "✅ JSPrettify 已安装到 /opt/bin/jsprettify"
            elif [ -w "/usr/bin" ]; then
                sudo cp dist/jsprettify /usr/bin/jsprettify
                echo "✅ JSPrettify 已安装到 /usr/bin/jsprettify"
            else
                echo "❌ 无法找到可写的系统路径，请手动安装"
                exit 1
            fi
        else
            echo "❌ 未找到 sudo 命令，请手动安装"
            exit 1
        fi
    else
        # 以 root 权限运行
        if [ -w "/usr/local/bin" ]; then
            cp dist/jsprettify /usr/local/bin/jsprettify
            echo "✅ JSPrettify 已安装到 /usr/local/bin/jsprettify"
        elif [ -w "/opt/bin" ]; then
            cp dist/jsprettify /opt/bin/jsprettify
            echo "✅ JSPrettify 已安装到 /opt/bin/jsprettify"
        elif [ -w "/usr/bin" ]; then
            cp dist/jsprettify /usr/bin/jsprettify
            echo "✅ JSPrettify 已安装到 /usr/bin/jsprettify"
        else
            echo "❌ 无法找到可写的系统路径，请手动安装"
            exit 1
        fi
    fi
    
    # 设置执行权限
    chmod +x /usr/local/bin/jsprettify 2>/dev/null || chmod +x /opt/bin/jsprettify 2>/dev/null || chmod +x /usr/bin/jsprettify 2>/dev/null
    
    echo "🎉 安装完成! 现在可以使用 'jsprettify' 命令直接运行"
    echo "💡 示例: jsprettify test.min.js output.js"
}

# 检查Node.js是否已安装
check_node() {
    if ! command -v node &> /dev/null; then
        echo "❌ 错误: 未找到 Node.js"
        echo ""
        echo "💡 请安装 Node.js:"
        case "$(uname -s)" in
            Darwin*)
                echo "   macOS: 使用 Homebrew 安装: brew install node"
                echo "   或者访问 https://nodejs.org/ 下载安装程序"
                ;;
            Linux*)
                echo "   Ubuntu/Debian: sudo apt update && sudo apt install nodejs npm"
                echo "   CentOS/RHEL/Fedora: sudo yum install nodejs npm  或  sudo dnf install nodejs npm"
                echo "   Arch Linux: sudo pacman -S nodejs npm"
                echo "   或者访问 https://nodejs.org/ 下载安装程序"
                ;;
            *)
                echo "   请访问 https://nodejs.org/ 下载安装程序"
                ;;
    esac
    echo ""
    echo "   推荐安装 LTS (长期支持) 版本以获得最佳兼容性和稳定性"
    exit 1
fi

# 检查Node.js版本
node_version=$(node --version 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "❌ 错误: 无法获取 Node.js 版本"
    exit 1
fi

# 解析版本号
version_match=$(echo "$node_version" | sed -E 's/v([0-9]+)\.([0-9]+)\.([0-9]+)/\1/')
major_version=${version_match:-0}

if [ "$major_version" -lt 14 ]; then
    echo "❌ 错误: JSPrettify 需要 Node.js 版本 >= 14.0.0"
    echo "❌ 当前版本: $node_version"
    echo ""
    echo "💡 请安装或升级 Node.js:"
    case "$(uname -s)" in
        Darwin*)
            echo "   macOS: 使用 Homebrew 安装: brew install node"
            echo "   或者访问 https://nodejs.org/ 下载安装程序"
            ;;
        Linux*)
            echo "   Ubuntu/Debian: sudo apt update && sudo apt install nodejs npm"
            echo "   CentOS/RHEL/Fedora: sudo yum install nodejs npm  或  sudo dnf install nodejs npm"
            echo "   Arch Linux: sudo pacman -S nodejs npm"
            echo "   或者访问 https://nodejs.org/ 下载安装程序"
            ;;
        *)
            echo "   请访问 https://nodejs.org/ 下载安装程序"
            ;;
    esac
    echo ""
    echo "   推荐安装 LTS (长期支持) 版本以获得最佳兼容性和稳定性"
    exit 1
fi
}

# 检查dist/jsprettify是否存在
if [ ! -f "dist/jsprettify" ]; then
    echo "❌ 错误: 未找到 dist/jsprettify 文件"
    echo "💡 请先构建项目: npx @vercel/ncc build src/index.js -o dist --minify"
    exit 1
fi

# 解析命令行参数
case "${1:-}" in
    --install|-i)
        check_node
        install_jsprettify
        ;;
    --help|-h|"")
        show_help
        ;;
    *)
        check_node
        # 运行jsprettify
        exec node dist/jsprettify "$@"
        ;;
esac