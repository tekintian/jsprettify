# PowerShell 运行脚本，用于运行或安装 JSPrettify

# windows 运行脚本，用于运行或安装 JSPrettify
# Author: tekintian@gmail.com (https://dev.tekin.cn)
# Version: 1.0.0
# 说明：
# 此脚本用于运行或安装 JSPrettify。
# 可以在 PowerShell 中直接运行，也可以添加到系统 PATH 中作为全局命令。

param(
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$Arguments,

    [switch]$Install,
    [switch]$Help
)

function Show-Help {
    Write-Host "Usage: .\run-windows.ps1 [options] [input.js] [output.js]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -Install          将 JSPrettify 安装到系统全局路径"
    Write-Host "  -Help             显示此帮助信息"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\run-windows.ps1 test.min.js                    # 运行 JSPrettify 处理文件"
    Write-Host "  .\run-windows.ps1 test.min.js output.js          # 指定输出文件"
    Write-Host "  .\run-windows.ps1 -Install                       # 全局安装 JSPrettify"
    Write-Host ""
}

function Install-JSPrettify {
    Write-Host "🔧 正在安装 JSPrettify..." -ForegroundColor Green
    
    # 查找合适的安装位置
    $installDir = Join-Path $env:ProgramFiles "JSPrettify"
    
    # 创建安装目录
    if (!(Test-Path $installDir)) {
        New-Item -ItemType Directory -Path $installDir -Force
    }
    
    # 复制文件
    Copy-Item "jsprettify" "$installDir\jsprettify.exe" -Force
    
    # 添加到PATH环境变量
    $currentPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
    if ($currentPath -notlike "*$installDir*") {
        $newPath = $currentPath + ";$installDir"
        [System.Environment]::SetEnvironmentVariable("Path", $newPath, "User")
        
        # 更新当前会话的PATH
        $env:Path = $env:Path + ";$installDir"
        
        Write-Host "✅ PATH 环境变量已更新" -ForegroundColor Green
    }
    
    Write-Host "✅ JSPrettify 已安装到 $installDir" -ForegroundColor Green
    Write-Host "🎉 安装完成! 现在可以从任意位置使用 'jsprettify' 命令" -ForegroundColor Green
    Write-Host "💡 示例: jsprettify test.min.js output.js" -ForegroundColor Yellow
}

function Check-Node {
    # 检查Node.js是否已安装
    if (!(Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Host "❌ 错误: 未找到 Node.js" -ForegroundColor Red
        Write-Host ""
        Write-Host "💡 请安装 Node.js:" -ForegroundColor Yellow
        Write-Host "   方法1 (使用 Chocolatey): choco install nodejs" -ForegroundColor Yellow
        Write-Host "   方法2 (使用 Scoop): scoop install nodejs" -ForegroundColor Yellow
        Write-Host "   方法3: 访问 https://nodejs.org/ 下载安装程序" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "   推荐安装 LTS (长期支持) 版本以获得最佳兼容性和稳定性" -ForegroundColor Yellow
        exit 1
    }

    # 检查Node.js版本
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 错误: 无法获取 Node.js 版本" -ForegroundColor Red
        exit 1
    }

    # 解析版本号
    $versionMatch = $nodeVersion -match 'v(\d+)\.(\d+)\.(\d+)'
    if ($versionMatch) {
        $major = [int]$matches[1]
        if ($major -lt 16) {
            Write-Host "❌ 错误: JSPrettify 需要 Node.js 版本 >= 16.0.0" -ForegroundColor Red
            Write-Host "❌ 当前版本: $nodeVersion" -ForegroundColor Red
            Write-Host ""
            Write-Host "💡 请安装或升级 Node.js:" -ForegroundColor Yellow
            Write-Host "   方法1 (使用 Chocolatey): choco install nodejs" -ForegroundColor Yellow
            Write-Host "   方法2 (使用 Scoop): scoop install nodejs" -ForegroundColor Yellow
            Write-Host "   方法3: 访问 https://nodejs.org/ 下载安装程序" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "   推荐安装 LTS (长期支持) 版本以获得最佳兼容性和稳定性" -ForegroundColor Yellow
            exit 1
        }
    }
}

# 检查dist/jsprettify是否存在
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$jsprettifyPath = Join-Path $scriptDir "jsprettify"

if (!(Test-Path $jsprettifyPath)) {
    Write-Host "❌ 错误: 未找到 jsprettify 文件" -ForegroundColor Red
    Write-Host "💡 请先构建项目: npx @vercel/ncc build src/index.js -o dist --minify" -ForegroundColor Yellow
    exit 1
}

# 处理参数
if ($Help) {
    Show-Help
} elseif ($Install) {
    Check-Node
    Install-JSPrettify
} elseif ($Arguments.Count -eq 0) {
    Show-Help
} else {
    Check-Node
    # 运行jsprettify，处理shebang问题
    $content = Get-Content $jsprettifyPath -Raw
    $cleanContent = $content -replace "^#![^\r\n]*\r?\n?", ""
    $tempFile = Join-Path $env:TEMP "jsprettify_temp_$([Guid]::NewGuid()).js"
    Set-Content -Path $tempFile -Value $cleanContent -Encoding UTF8
    
    try {
        node $tempFile @Arguments
    } finally {
        if (Test-Path $tempFile) {
            Remove-Item $tempFile
        }
    }
}