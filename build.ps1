# PowerShell 跨平台构建脚本
# 支持 Windows, macOS, Linux
# 用于构建 JSPrettify 项目

param(
    [switch]$Clean,
    [switch]$Help
)

function Show-Help {
    Write-Host "Usage: .\build.ps1 [options]" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Cyan
    Write-Host "  -Clean    清理之前的构建输出"
    Write-Host "  -Help     显示此帮助信息"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Cyan
    Write-Host "  .\build.ps1                 # 执行构建"
    Write-Host "  .\build.ps1 -Clean          # 清理并重新构建"
}

function Clean-Build {
    Write-Host "🧹 清理构建输出..." -ForegroundColor Yellow
    
    # 删除 dist 目录（如果存在）
    if (Test-Path "dist") {
        Remove-Item "dist" -Recurse -Force
        Write-Host "✅ dist 目录已删除" -ForegroundColor Green
    }
    
    # 删除可能存在的测试输出文件
    if (Test-Path "output.js") {
        Remove-Item "output.js" -Force
        Write-Host "✅ output.js 已删除" -ForegroundColor Green
    }
    
    Write-Host "✅ 清理完成" -ForegroundColor Green
}

function Check-Prerequisites {
    Write-Host "🔍 检查构建依赖..." -ForegroundColor Yellow
    
    # 检查 Node.js
    if (!(Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Host "❌ 错误: 未找到 Node.js" -ForegroundColor Red
        Write-Host ""
        Write-Host "💡 请安装 Node.js:" -ForegroundColor Yellow
        if ($IsWindows -or $env:OS -like "*Windows*") {
            Write-Host "   方法1 (使用 Chocolatey): choco install nodejs" -ForegroundColor Yellow
            Write-Host "   方法2 (使用 Scoop): scoop install nodejs" -ForegroundColor Yellow
            Write-Host "   方法3: 访问 https://nodejs.org/ 下载安装程序" -ForegroundColor Yellow
        } else {
            Write-Host "   方法1 (使用包管理器): brew install nodejs (macOS) 或 sudo apt install nodejs (Ubuntu)" -ForegroundColor Yellow
            Write-Host "   方法2: 访问 https://nodejs.org/ 下载安装程序" -ForegroundColor Yellow
        }
        exit 1
    }

    # 检查 Node.js 版本
    $nodeVersion = node --version
    Write-Host "✅ Node.js 版本: $nodeVersion" -ForegroundColor Green
    
    $versionMatch = $nodeVersion -match 'v(\d+)\.(\d+)\.(\d+)'
    if ($versionMatch) {
        $major = [int]$matches[1]
        if ($major -lt 16) {
            Write-Host "❌ 错误: JSPrettify 需要 Node.js 版本 >= 16.0.0" -ForegroundColor Red
            Write-Host "❌ 当前版本: $nodeVersion" -ForegroundColor Red
            exit 1
        }
    }

    # 检查 npm
    if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
        Write-Host "❌ 错误: 未找到 npm" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ npm 已找到" -ForegroundColor Green
    
    # 检查 ncc
    if (!(Get-Command ncc -ErrorAction SilentlyContinue)) {
        Write-Host "⚠️  ncc 未找到，将使用 npx 安装" -ForegroundColor Yellow
    } else {
        Write-Host "✅ ncc 已找到" -ForegroundColor Green
    }
}

function Perform-Build {
    Write-Host "🔨 开始构建..." -ForegroundColor Yellow
    
    # 创建 dist 目录
    if (!(Test-Path "dist")) {
        New-Item -ItemType Directory -Name "dist" -Force | Out-Null
        Write-Host "✅ dist 目录已创建" -ForegroundColor Green
    }
    
    # 使用 ncc 构建
    Write-Host "📦 使用 ncc 构建项目..." -ForegroundColor Yellow
    
    # 检查是否有本地安装的 ncc
    $nccAvailable = $false
    if (Test-Path "node_modules/.bin/ncc") {
        $nccAvailable = $true
        Write-Host "✅ 使用本地 ncc" -ForegroundColor Green
    } else {
        Write-Host "⚠️  使用 npx 安装并运行 ncc" -ForegroundColor Yellow
    }
    
    if ($nccAvailable) {
        ncc build src/index.js -o dist --minify
    } else {
        npx @vercel/ncc build src/index.js -o dist --minify
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 构建失败" -ForegroundColor Red
        exit $LASTEXITCODE
    }
    
    Write-Host "✅ ncc 构建完成" -ForegroundColor Green
    
    # 重命名输出文件
    if (Test-Path "dist/index.js") {
        Move-Item "dist/index.js" "dist/jsprettify"
        Write-Host "✅ 输出文件已重命名为 dist/jsprettify" -ForegroundColor Green
    } else {
        Write-Host "❌ 错误: dist/index.js 不存在" -ForegroundColor Red
        exit 1
    }
    
    # 根据操作系统复制适当的运行脚本
    if ($IsWindows -or $env:OS -like "*Windows*") {
        Write-Host "📝 为 Windows 复制运行脚本..." -ForegroundColor Yellow
        Copy-Item "run-windows.ps1" "dist/run-windows.ps1" -Force
        Write-Host "✅ Windows 运行脚本已复制" -ForegroundColor Green
    } else {
        Write-Host "📝 为 Unix/Linux/macOS 复制运行脚本..." -ForegroundColor Yellow
        Copy-Item "run-unix.sh" "dist/run-unix.sh" -Force
        # 设置执行权限
        if ($IsLinux -or $IsMacOS) {
            bash -c "chmod +x dist/run-unix.sh"
            Write-Host "✅ Unix 运行脚本已复制并设置权限" -ForegroundColor Green
        } else {
            Write-Host "✅ Unix 运行脚本已复制" -ForegroundColor Green
        }
    }
    
    # 总是复制跨平台的 PowerShell 脚本
    Copy-Item "run-windows.ps1" "dist/run-windows.ps1" -Force
    Write-Host "✅ Windows 运行脚本已复制" -ForegroundColor Green
}

function Test-Build {
    Write-Host "🧪 测试构建结果..." -ForegroundColor Yellow
    
    # 检查构建的文件是否存在
    if (!(Test-Path "dist/jsprettify")) {
        Write-Host "❌ 错误: dist/jsprettify 不存在" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ 构建文件存在" -ForegroundColor Green
    
    # 准备测试
    if (Test-Path "test_output.js") {
        Remove-Item "test_output.js" -Force
    }
    
    # 在不同平台上执行测试
    if ($IsWindows -or $env:OS -like "*Windows*") {
        Write-Host "🔧 在 Windows 上测试..." -ForegroundColor Yellow
        
        # 由于 jsprettify 包含 shebang，在 Windows 上需要特殊处理
        $content = Get-Content "dist/jsprettify" -Raw
        $cleanContent = $content -replace "^#![^\r\n]*\r?\n?", ""
        $tempFile = Join-Path $env:TEMP "jsprettify_test_$([Guid]::NewGuid()).js"
        Set-Content -Path $tempFile -Value $cleanContent -Encoding UTF8
        
        try {
            node $tempFile "test_data/test.min.js" "test_output.js"
            $exitCode = $LASTEXITCODE
            
            if ($exitCode -eq 0 -and (Test-Path "test_output.js")) {
                Write-Host "✅ Windows 测试通过" -ForegroundColor Green
            } else {
                Write-Host "❌ Windows 测试失败" -ForegroundColor Red
                Write-Host "Exit code: $exitCode" -ForegroundColor Red
                exit $exitCode
            }
        } finally {
            if (Test-Path $tempFile) {
                Remove-Item $tempFile
            }
        }
    } else {
        Write-Host "🔧 在 Unix/Linux/macOS 上测试..." -ForegroundColor Yellow
        
        # 在 Unix 系统上设置执行权限
        bash -c "chmod +x dist/jsprettify"
        
        # 执行测试
        & bash -c "./dist/jsprettify test_data/test.min.js test_output.js"
        $exitCode = $LASTEXITCODE
        
        if ($exitCode -eq 0 -and (Test-Path "test_output.js")) {
            Write-Host "✅ Unix 测试通过" -ForegroundColor Green
        } else {
            Write-Host "❌ Unix 测试失败" -ForegroundColor Red
            Write-Host "Exit code: $exitCode" -ForegroundColor Red
            exit $exitCode
        }
    }
    
    # 清理测试输出
    if (Test-Path "test_output.js") {
        Remove-Item "test_output.js" -Force
    }
}

# 主执行逻辑
if ($Help) {
    Show-Help
    return
}

Write-Host "🚀 开始 JSPrettify 构建过程" -ForegroundColor Cyan
Write-Host "💻 平台: $([System.Environment]::OSVersion.Platform)" -ForegroundColor Cyan
Write-Host "🐧 是否 Linux: $IsLinux" -ForegroundColor Cyan
Write-Host "🍎 是否 macOS: $IsMacOS" -ForegroundColor Cyan
Write-Host "🪟 是否 Windows: $IsWindows" -ForegroundColor Cyan
Write-Host ""

# 如果指定了 Clean 参数，则先清理
if ($Clean) {
    Clean-Build
}

# 检查前置条件
Check-Prerequisites

# 执行构建
Perform-Build

# 测试构建结果
Test-Build

Write-Host ""
Write-Host "🎉 构建成功完成!" -ForegroundColor Green
Write-Host "📁 构建产物位于 dist/ 目录:" -ForegroundColor Green

# 列出构建产物
Get-ChildItem -Path "dist" | ForEach-Object {
    Write-Host "   📄 $($_.Name)" -ForegroundColor White
}

Write-Host ""
Write-Host "💡 使用方法:" -ForegroundColor Cyan
if ($IsWindows -or $env:OS -like "*Windows*") {
    Write-Host "   node dist/jsprettify <input.js> <output.js>" -ForegroundColor White
    Write-Host "   或使用 PowerShell 脚本: .\dist\run-windows.ps1 <input.js> <output.js>" -ForegroundColor White
} else {
    Write-Host "   ./dist/jsprettify <input.js> <output.js>" -ForegroundColor White
    Write-Host "   或使用 Shell 脚本: ./dist/run-unix.sh <input.js> <output.js>" -ForegroundColor White
}
