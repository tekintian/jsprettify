#!/usr/bin/env node
// JsPrettify 主程序
// Author: tekintian@gmail.com (https://dev.tekin.cn)
// License: MIT
// 获取操作系统信息
const os = require('os');

// 检查Node.js版本
function checkNodeVersion() {
    // 尝试使用semver进行精确版本比较
    let semver;
    try {
        semver = require('semver');
    } catch (e) {
        // 如果semver不可用，则使用简单比较
        const versionMatch = process.version.match(/^v(\d+)\.(\d+)\.(\d+)/);
        if (versionMatch) {
            const major = parseInt(versionMatch[1], 10);
            if (major < 16) {
                showNodeInstallationInstructions(major);
            }
        }
        return;
    }
    
    const requiredVersion = '16.0.0';
    
    if (!semver.gte(process.version, requiredVersion)) {
        showNodeInstallationInstructions(parseInt(process.version.match(/^v(\d+)/)[1]));
    }
}

// 显示Node.js安装说明
function showNodeInstallationInstructions(currentMajorVersion) {
    const platform = os.platform();
    console.error(`❌ 错误: JSPrettify 需要 Node.js 版本 >= 16.x`);
    console.error(`❌ 当前版本: ${process.version}`);
    console.error('');
    console.error('💡 请安装或升级 Node.js:');
    
    switch(platform) {
        case 'darwin': // macOS
            console.error('   macOS: 使用 Macport (推荐) 或 Homebrew 安装:');
            console.error('      1. 安装 Macport: https://www.macports.org/install.php');
            console.error('      2. 安装 Node.js: sudo port install nodejs20');
            console.error('   或者访问 https://nodejs.org/ 下载安装程序');
            break;
            
        case 'linux':
            console.error('   Ubuntu/Debian: sudo apt update && sudo apt install nodejs npm');
            console.error('   CentOS/RHEL/Fedora: sudo yum install nodejs npm  或  sudo dnf install nodejs npm');
            console.error('   Arch Linux: sudo pacman -S nodejs npm');
            console.error('   或者使用 NodeSource 仓库获取最新版本: https://github.com/nodesource/distributions');
            break;
            
        case 'win32': // Windows
            console.error('   Windows: 访问 https://nodejs.org/ 下载v16.x以上版本并运行安装程序');
            console.error('   或者使用 Chocolatey: chco install nodejs');
            console.error('   或者使用 Scoop: scoop install nodejs');
            break;
            
        default:
            console.error(`   请访问 https://nodejs.org/ 下载适用于您的系统的v16.x以上版本安装程序`);
    }
    
    console.error('');
    console.error('   推荐安装 v16.x以上 LTS (长期支持) 版本以获得最佳兼容性和稳定性');
    process.exit(1);
}

// 检查Node.js是否可用
try {
    checkNodeVersion();
} catch (e) {
    // 如果发生任何错误，也显示安装说明
    showNodeInstallationInstructions(0);
}

const fs = require('fs');
const path = require('path');

/**
 * 使用 Prettier 格式化代码 - 使用standalone版本并显式指定插件
 */
async function prettifyWithPrettier(code) {
    // 在运行时动态导入prettier standalone版本和所需插件
    const prettier = require('prettier/standalone');
    const babelPlugin = require('prettier/plugins/babel');
    const estreePlugin = require('prettier/plugins/estree');
    
    try {
        const formattedCode = prettier.format(code, {
            parser: 'babel',
            plugins: [babelPlugin, estreePlugin],
            semi: false,
            singleQuote: false,
            tabWidth: 4,
            printWidth: 120
        });
        return formattedCode;
    } catch (e) {
        console.error('Prettier formatting error:', e.message);
        throw e;
    }
}

/**
 * 主函数
 */
async function main() {
    const args = process.argv.slice(2);

    if (args.length < 1) {
        console.log('Usage: jsprettify <input.js> [output.js]');
        console.log('');
        console.log('Examples:');
        console.log('  jsprettify test.min.js test_prettified.js');
        process.exit(1);
    }

    const inputFile = args[0];
    const outputFile = args[1] || inputFile.replace(/\.min\.js$/, '.js').replace(/\.js$/, '_prettified.js');

    console.log(`Reading: ${inputFile}`);

    if (!fs.existsSync(inputFile)) {
        console.error(`Error: File not found: ${inputFile}`);
        process.exit(1);
    }

    const code = fs.readFileSync(inputFile, 'utf8');

    console.log('Prettifying...');
    const startTime = Date.now();

    try {
        let prettified = await prettifyWithPrettier(code);
        console.log('✓ Using Prettier');

        const elapsed = Date.now() - startTime;
        console.log(`Time: ${elapsed}ms`);

        // 写入输出文件
        fs.writeFileSync(outputFile, prettified);
        console.log(`✓ Written to: ${outputFile}`);

        // 检查语法是否正确
        const { spawn } = require('child_process');
        const nodeCheck = spawn('node', ['--check', outputFile]);
        nodeCheck.on('close', (code) => {
            if (code === 0) {
                console.log('✓ Syntax check passed');
            } else {
                console.log('⚠ Syntax check failed (but file written)');
            }
        });

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

// 运行主函数
main().catch(console.error);