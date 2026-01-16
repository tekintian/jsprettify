#!/usr/bin/env node

/**
 * JSPrettify Full 版本
 * 使用内置的 ChromeDriver，不依赖系统 Chrome
 * 需要: npx @puppeteer/browsers install chromedriver@116.0.5793.0
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

/**
 * 获取内置 ChromeDriver 路径
 */
function getChromeDriverPath() {
    const { platform } = process;
    const projectRoot = path.join(__dirname, '.chromedriver');

    if (platform === 'darwin') {
        return path.join(projectRoot, 'mac-116', 'chromedriver');
    } else if (platform === 'win32') {
        return path.join(projectRoot, 'win-116', 'chromedriver.exe');
    } else if (platform === 'linux') {
        return path.join(projectRoot, 'linux-116', 'chromedriver');
    }

    return null;
}

/**
 * 检查并下载 ChromeDriver
 */
async function ensureChromeDriver() {
    const driverPath = getChromeDriverPath();

    if (driverPath && fs.existsSync(driverPath)) {
        console.log('✓ ChromeDriver found at:', driverPath);
        return driverPath;
    }

    console.log('⚠ ChromeDriver not found, downloading...');
    console.log('Running: npx @puppeteer/browsers install chromedriver@116.0.5793.0');

    return new Promise((resolve, reject) => {
        const install = spawn('npx', ['@puppeteer/browsers', 'install', 'chromedriver@116.0.5793.0'], {
            cwd: __dirname,
            stdio: 'inherit'
        });

        install.on('close', (code) => {
            if (code === 0) {
                const newDriverPath = getChromeDriverPath();
                if (newDriverPath && fs.existsSync(newDriverPath)) {
                    console.log('✓ ChromeDriver installed successfully');
                    resolve(newDriverPath);
                } else {
                    reject(new Error('ChromeDriver installed but not found'));
                }
            } else {
                reject(new Error('Failed to install ChromeDriver'));
            }
        });
    });
}

/**
 * 使用 ChromeDriver + Chrome DevTools Protocol 格式化
 */
async function prettifyWithCDP(code, driverPath) {
    const CDP = require('chrome-remote-interface');

    return new Promise(async (resolve, reject) => {
        let client;
        let chromeProcess;

        try {
            const { platform } = process;
            const userDataDir = platform === 'win32'
                ? `C:\\Windows\\Temp\\chrome-debug-${Date.now()}`
                : `/tmp/chrome-debug-${Date.now()}`;

            // 使用 ChromeDriver 启动 Chrome（如果没有系统 Chrome，使用内置的）
            const chromeArgs = [
                '--remote-debugging-port=9222',
                '--no-first-run',
                '--no-default-browser-check',
                '--user-data-dir=' + userDataDir,
                '--disable-gpu',
                '--disable-dev-shm-usage',
                'about:blank'
            ];

            // 尝试使用系统 Chrome
            let chromePath = null;
            const possiblePaths = [];

            if (platform === 'darwin') {
                possiblePaths.push(
                    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
                    '/Applications/Chromium.app/Contents/MacOS/Chromium'
                );
            } else if (platform === 'win32') {
                possiblePaths.push(
                    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
                    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
                    'C:\\Users\\' + process.env.USERNAME + '\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'
                );
            } else if (platform === 'linux') {
                possiblePaths.push(
                    '/usr/bin/google-chrome',
                    '/usr/bin/chromium-browser',
                    '/usr/bin/chromium',
                    '/snap/bin/chromium'
                );
            }

            for (const path of possiblePaths) {
                if (fs.existsSync(path)) {
                    chromePath = path;
                    break;
                }
            }

            if (!chromePath) {
                throw new Error('No Chrome installation found. Please install Chrome or use the lite version.');
            }

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
            if (platform === 'win32') {
                spawn('cmd', ['/c', 'rd', '/s', '/q', userDataDir]);
            } else {
                spawn('rm', ['-rf', userDataDir]);
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
 * 使用 Prettier 格式化代码（备用）
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
 * 主函数
 */
async function main() {
    const args = process.argv.slice(2);

    if (args.length < 1) {
        console.log('JSPrettify Full - 使用 Chrome DevTools Protocol 格式化 JavaScript');
        console.log('');
        console.log('Usage: jsprettify-full <input.js> [output.js]');
        console.log('');
        console.log('Examples:');
        console.log('  ./jsprettify-full bg.min.js bg_prettified.js');
        console.log('  ./jsprettify-full ct.min.js ct_prettified.js');
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

        // 首先确保 ChromeDriver 可用
        await ensureChromeDriver();

        // 尝试使用 Chrome DevTools Protocol
        try {
            prettified = await prettifyWithCDP(code, getChromeDriverPath());
            console.log('✓ Using Chrome DevTools Protocol');
        } catch (e) {
            console.log('⚠ CDP failed, using Prettier fallback...');
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
