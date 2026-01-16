#!/usr/bin/env node

/**
 * JSPrettify Lite 版本
 * 调用系统安装的 Chrome 浏览器进行格式化
 * 需要系统安装 Chrome/Chromium
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

/**
 * 获取系统 Chrome 可执行文件路径
 */
function getChromePath() {
    const { platform } = process;
    const possiblePaths = [];

    if (platform === 'darwin') {
        possiblePaths.push(
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            '/Applications/Chromium.app/Contents/MacOS/Chromium',
            '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'
        );
    } else if (platform === 'win32') {
        possiblePaths.push(
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Users\\' + process.env.USERNAME + '\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
        );
    } else if (platform === 'linux') {
        possiblePaths.push(
            '/usr/bin/google-chrome',
            '/usr/bin/chromium-browser',
            '/usr/bin/chromium',
            '/snap/bin/chromium',
            '/usr/bin/google-chrome-stable',
            '/usr/bin/microsoft-edge'
        );
    }

    for (const path of possiblePaths) {
        if (fs.existsSync(path)) {
            return path;
        }
    }

    return null;
}

/**
 * 使用 Prettier 格式化代码（备用）
 */
async function prettifyWithPrettier(code) {
    const prettier = require('prettier');
    return prettier.format(code, {
        parser: 'babel',
        semi: false,
        singleQuote: false,
        tabWidth: 4,
        printWidth: 120
    });
}

/**
 * 使用系统 Chrome 格式化代码
 */
async function prettifyWithChrome(code) {
    const CDP = require('chrome-remote-interface');

    return new Promise(async (resolve, reject) => {
        let client;
        let chromeProcess;

        try {
            const chromePath = getChromePath();
            if (!chromePath) {
                const { platform } = process;
                console.error('');
                console.error('❌ Error: Chrome/Chromium not found on your system.');
                console.error('');
                console.error('Please install Chrome or Chromium to use this feature:');
                console.error('');
                if (platform === 'darwin') {
                    console.error('  macOS: Download from https://www.google.com/chrome/');
                    console.error('         or use: brew install --cask google-chrome');
                } else if (platform === 'win32') {
                    console.error('  Windows: Download from https://www.google.com/chrome/');
                    console.error('          or from https://mirrors.huaweicloud.com/chromium-browser-snapshots/');
                } else if (platform === 'linux') {
                    console.error('  Linux:   apt-get install chromium-browser');
                    console.error('          or download from https://mirrors.huaweicloud.com/chromium-browser-snapshots/');
                }
                console.error('');
                console.error('Alternative: Use jsprettify-full (no Chrome required)');
                console.error('');
                throw new Error('Chrome/Chromium not found');
            }

            console.log(`  Using Chrome: ${chromePath}`);

            const { platform } = process;
            const userDataDir = platform === 'win32'
                ? `C:\\Windows\\Temp\\chrome-debug-${Date.now()}`
                : `/tmp/chrome-debug-${Date.now()}`;

            const chromeArgs = [
                '--remote-debugging-port=9222',
                '--no-first-run',
                '--no-default-browser-check',
                '--user-data-dir=' + userDataDir,
                'about:blank'
            ];

            // 启动 Chrome
            chromeProcess = spawn(chromePath, chromeArgs);

            // 等待 Chrome 启动
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 连接到 Chrome DevTools Protocol
            client = await CDP({ port: 9222 });
            const { Debugger, Runtime } = client;

            await Debugger.enable();
            await Runtime.enable();

            // 脚本 ID
            const { scriptId } = await Runtime.compileScript({
                expression: code,
                sourceURL: 'inline-script.js',
                persistScript: true
            });

            // 使用 Debugger.getScriptSource 获取源码
            const { scriptSource } = await Debugger.getScriptSource({ scriptId });

            await client.close();
            if (chromeProcess) chromeProcess.kill();

            // 清理用户数据目录
            try {
                if (platform === 'win32') {
                    spawn('cmd', ['/c', 'rd', '/s', '/q', userDataDir]);
                } else {
                    spawn('rm', ['-rf', userDataDir]);
                }
            } catch (e) {
                // 忽略清理错误
            }

            resolve(scriptSource);
        } catch (error) {
            if (client) await client.close();
            if (chromeProcess) chromeProcess.kill();
            reject(error);
        }
    });
}

/**
 * 主函数
 */
async function main() {
    const args = process.argv.slice(2);

    if (args.length < 1) {
        console.log('JSPrettify Lite - 使用系统 Chrome 浏览器格式化 JavaScript');
        console.log('');
        console.log('Usage: jsprettify-lite <input.js> [output.js]');
        console.log('');
        console.log('Requirements:');
        console.log('  - Chrome/Chromium must be installed on your system');
        console.log('');
        console.log('Examples:');
        console.log('  ./jsprettify-lite bg.min.js bg_prettified.js');
        console.log('  ./jsprettify-lite ct.min.js ct_prettified.js');
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
        let prettified;

        // 尝试使用系统 Chrome
        try {
            prettified = await prettifyWithChrome(code);
            console.log('✓ Using Chrome DevTools Protocol');
        } catch (e) {
            console.log('⚠ Chrome not available, using Prettier fallback...');
            prettified = await prettifyWithPrettier(code);
            console.log('✓ Using Prettier');
        }

        const elapsed = Date.now() - startTime;
        console.log(`Time: ${elapsed}ms`);

        // 写入输出文件
        fs.writeFileSync(outputFile, prettified);
        console.log(`✓ Written to: ${outputFile}`);

        // 验证语法
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

main().catch(console.error);
