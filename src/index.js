#!/usr/bin/env node

// 检查Node.js版本
function checkNodeVersion() {
    const semver = require('semver');
    const requiredVersion = '14.0.0';
    
    if (!semver.gte(process.version, requiredVersion)) {
        console.error(`❌ 错误: JSPrettify 需要 Node.js 版本 >= ${requiredVersion}`);
        console.error(`❌ 当前版本: ${process.version}`);
        console.error('');
        console.error('💡 请安装或升级 Node.js:');
        console.error('   macOS: brew install node 或访问 https://nodejs.org/');
        console.error('   Ubuntu/Debian: sudo apt install nodejs npm');
        console.error('   CentOS/RHEL: sudo yum install nodejs npm');
        console.error('   Windows: 访问 https://nodejs.org/ 下载安装程序');
        console.error('');
        console.error('   推荐安装 LTS (长期支持) 版本');
        process.exit(1);
    }
}

// 检查Node.js是否可用
try {
    checkNodeVersion();
} catch (e) {
    // 如果semver模块不可用，尝试简单的版本比较
    const versionMatch = process.version.match(/^v(\d+)\.(\d+)\.(\d+)/);
    if (versionMatch) {
        const major = parseInt(versionMatch[1], 10);
        if (major < 14) {
            console.error(`❌ 错误: JSPrettify 需要 Node.js 版本 >= 14.0.0`);
            console.error(`❌ 当前版本: ${process.version}`);
            console.error('');
            console.error('💡 请安装或升级 Node.js:');
            console.error('   macOS: brew install node 或访问 https://nodejs.org/');
            console.error('   Ubuntu/Debian: sudo apt install nodejs npm');
            console.error('   CentOS/RHEL: sudo yum install nodejs npm');
            console.error('   Windows: 访问 https://nodejs.org/ 下载安装程序');
            console.error('');
            console.error('   推荐安装 LTS (长期支持) 版本');
            process.exit(1);
        }
    }
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
        console.log('Usage: node src/index.js <input.js> [output.js]');
        console.log('');
        console.log('Examples:');
        console.log('  node src/index.js test.min.js bg_prettified.js');
        console.log('  node src/index.js ct.min.js ct_prettified.js');
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