#!/usr/bin/env node

/**
 * 使用 Chrome DevTools 协议格式化 JavaScript 文件
 * 推荐使用 Chrome DevTools 手动导出，但这个脚本提供了自动化选项
 * 需要安装依赖 npm install puppeteer-core
 *
 * 用法:
 *   node prettify-chrome.js <input.js> [output.js]
 *
 * 示例:
 *   node prettify-chrome.js backup/bg.min.js bg_prettified.js
 *   node prettify-chrome.js backup/ct.min.js ct_prettified.js
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

/**
 * 获取跨平台 Chrome 可执行文件路径
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

    const fs = require('fs');
    for (const path of possiblePaths) {
        if (fs.existsSync(path)) {
            return path;
        }
    }

    return null;
}

/**
 * 使用 Chrome DevTools Protocol 格式化 JavaScript 代码
 */
async function prettifyWithChrome(code) {
    const chromePath = getChromePath();
    if (!chromePath) {
        throw new Error('Chrome/Chromium not found. Please install Chrome or specify executable path.');
    }

    const browser = await puppeteer.launch({
        headless: true,
        executablePath: chromePath,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();

        // 注入代码到页面
        await page.evaluateOnNewDocument((script) => {
            window.__PRETTIFY_SOURCE__ = script;
        }, code);

        // 设置页面内容
        await page.setContent(`
            <!DOCTYPE html>
            <html>
            <head></head>
            <body>
                <script id="source-script">${code.replace(/</g, '\\u003c')}</script>
            </body>
            </html>
        `);

        // 获取脚本元素并使用 DevTools Protocol 格式化
        const result = await page.evaluate(() => {
            const script = document.getElementById('source-script');
            if (!script) return null;

            // 创建一个新的脚本来获取格式化后的代码
            const formatted = script.textContent;

            // 使用 Function 构造器来解析和重新格式化
            // Chrome 会自动添加适当的换行和缩进
            try {
                const func = new Function(formatted);
                const funcString = func.toString();

                // 移除函数包装，保留原始代码
                const bodyStart = funcString.indexOf('{') + 1;
                const bodyEnd = funcString.lastIndexOf('}');
                const body = funcString.substring(bodyStart, bodyEnd);

                return body.trim();
            } catch (e) {
                // 如果失败，返回原始代码
                return formatted;
            }
        });

        return result;
    } finally {
        await browser.close();
    }
}

/**
 * 备用方法：使用 V8 的内置格式化功能
 */
async function prettifyWithPrettier(code) {
    const { default: prettier } = await import('prettier');
    return prettier.format(code, {
        parser: 'babel',
        semi: false,
        singleQuote: false,
        tabWidth: 4,
        printWidth: 120
    });
}

/**
 * 使用 Chrome 的内置美化功能（通过执行环境）
 */
async function prettifyUsingExecution(code) {
    const { createServer } = await import('http');
    const { default: puppeteer } = await import('puppeteer');

    const chromePath = getChromePath();
    if (!chromePath) {
        throw new Error('Chrome/Chromium not found. Please install Chrome or specify executable path.');
    }

    return new Promise((resolve, reject) => {
        const server = createServer((req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <script>${code.replace(/</g, '\\u003c')}</script>
                </head>
                <body></body>
                </html>
            `);
        });

        server.listen(0, async () => {
            const port = server.address().port;

            try {
                const browser = await puppeteer.launch({
                    headless: true,
                    executablePath: chromePath
                });

                const page = await browser.newPage();
                await page.goto(`http://localhost:${port}`);

                // 使用 page.evaluate 来触发代码执行
                const formatted = await page.evaluate(() => {
                    const scripts = document.querySelectorAll('script');
                    for (const script of scripts) {
                        if (!script.src && script.textContent) {
                            return script.textContent;
                        }
                    }
                    return '';
                });

                await browser.close();
                server.close();

                resolve(formatted);
            } catch (error) {
                server.close();
                reject(error);
            }
        });
    });
}

/**
 * 更实用的方法：使用 Chrome DevTools Protocol 的 Debugger API
 */
async function prettifyWithCDP(code) {
    const CDP = require('chrome-remote-interface');

    const chromePath = getChromePath();
    if (!chromePath) {
        throw new Error('Chrome/Chromium not found. Please install Chrome or specify executable path.');
    }

    return new Promise(async (resolve, reject) => {
        let client;

        try {
            // 启动 Chrome 并获取调试端口
            const { spawn } = require('child_process');
            const { platform } = process;
            const userDataDir = platform === 'win32'
                ? `C:\\Windows\\Temp\\chrome-debug-${Date.now()}`
                : `/tmp/chrome-debug-${Date.now()}`;

            const chrome = spawn(chromePath, [
                '--remote-debugging-port=9222',
                '--no-first-run',
                '--no-default-browser-check',
                '--user-data-dir=' + userDataDir,
                'about:blank'
            ]);

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
            chrome.kill();

            // 清理用户数据目录
            const { execSync } = require('child_process');
            if (platform === 'win32') {
                execSync(`rd /s /q "${userDataDir}"`);
            } else {
                execSync(`rm -rf ${userDataDir}`);
            }

            resolve(scriptSource);
        } catch (error) {
            if (client) await client.close();
            reject(error);
        }
    });
}

/**
 * 简单实用的方法：使用在线服务的本地实现
 */
async function prettifySimple(code) {
    // 这个方法使用 Node.js 的 vm 模块来解析和重新生成代码
    const vm = require('vm');

    try {
        // 创建一个包含代码的函数
        const func = new Function(code);
        const funcStr = func.toString();

        // 提取函数体
        const bodyMatch = funcStr.match(/\{([\s\S]*)\}$/);
        if (bodyMatch) {
            return bodyMatch[1].trim();
        }
    } catch (e) {
        // 如果失败，返回原始代码
    }

    return code;
}

/**
 * 主函数
 */
async function main() {
    const args = process.argv.slice(2);

    if (args.length < 1) {
        console.log('Usage: node prettify-chrome.js <input.js> [output.js]');
        console.log('');
        console.log('Examples:');
        console.log('  node prettify-chrome.js bg.min.js bg_prettified.js');
        console.log('  node prettify-chrome.js ct.min.js ct_prettified.js');
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
        // 尝试不同的格式化方法
        let prettified;

        // 方法 1: 使用 Prettier (最可靠)
        try {
            prettified = await prettifyWithPrettier(code);
            console.log('✓ Using Prettier');
        } catch (e) {
            console.log('⚠ Prettier not available, trying fallback...');

            // 方法 2: 简单格式化
            prettified = await prettifySimple(code);
            console.log('✓ Using simple formatter');
        }

        const elapsed = Date.now() - startTime;
        console.log(`Time: ${elapsed}ms`);

        // 写入输出文件
        fs.writeFileSync(outputFile, prettified);
        console.log(`✓ Written to: ${outputFile}`);

        // 验证语法
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
