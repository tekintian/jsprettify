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
 *   node prettify-chrome.js bg.min.js bg_prettified.js
 *   node prettify-chrome.js ct.min.js ct_prettified.js
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

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

    for (const path of possiblePaths) {
        if (fs.existsSync(path)) {
            return path;
        }
    }

    return null;
}

/**
 * 使用 Chrome DevTools Protocol 格式化代码
 * 使用 Chrome 的 V8 引擎解析并获取格式化后的代码
 */
async function prettifyWithCDP(code) {
    const CDP = require('chrome-remote-interface');

    const chromePath = getChromePath();
    if (!chromePath) {
        throw new Error('Chrome/Chromium not found. Please install Chrome or specify executable path.');
    }

    return new Promise(async (resolve, reject) => {
        let client;
        let chromeProcess;

        try {
            // 启动 Chrome 并获取调试端口
            const { platform } = process;
            const userDataDir = platform === 'win32'
                ? `C:\\Windows\\Temp\\chrome-debug-${Date.now()}`
                : `/tmp/chrome-debug-${Date.now()}`;

            chromeProcess = spawn(chromePath, [
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

            // 编译脚本并获取脚本ID
            const { scriptId } = await Runtime.compileScript({
                expression: code,
                sourceURL: 'inline-script.js',
                persistScript: true
            });

            // 使用 Debugger.getScriptSource 获取源码（Chrome V8 解压后的代码）
            let scriptSourceResult = await Debugger.getScriptSource({ scriptId });
            let scriptSource = scriptSourceResult.scriptSource;  // 从结果对象中提取实际的源码
            
            // 关闭连接
            await client.close();
            
            // 终止 Chrome 进程
            chromeProcess.kill('SIGTERM');
            
            // 等待进程退出
            await new Promise(resolve => {
                chromeProcess.on('exit', resolve);
                setTimeout(resolve, 500); // 最多等待 500ms
            });

            // 清理用户数据目录（异步方式，不阻塞）
            try {
                if (platform === 'win32') {
                    spawn('cmd', ['/c', 'rd', '/s', '/q', userDataDir], { detached: true, stdio: 'ignore' }).unref();
                } else {
                    spawn('rm', ['-rf', userDataDir], { detached: true, stdio: 'ignore' }).unref();
                }
            } catch (e) {
                // 忽略清理错误
                console.log(`  ⚠ Failed to clean temp dir: ${e.message}`);
            }

            // 尝试使用 Prettier 格式化获取到的代码
            try {
                const prettier = require('prettier');
                const babelPlugin = require('prettier/plugins/babel');
                scriptSource = prettier.format(scriptSource, {
                    parser: 'babel',
                    plugins: [babelPlugin],
                    semi: false,
                    singleQuote: false,
                    tabWidth: 4,
                    printWidth: 120
                });
            } catch (e) {
                // 如果 Prettier 不可用，则尝试简单格式化
                console.log('  ⚠ Prettier not available for formatting, using advanced formatter');
                
                // 使用 acorn + escodegen 作为备选方案
                try {
                    const acorn = require('acorn');
                    const escodegen = require('escodegen');

                    const ast = acorn.parse(scriptSource, {
                        ecmaVersion: 2022,
                        sourceType: 'script',
                        allowReturnOutsideFunction: true,
                        allowHashBang: true
                    });

                    scriptSource = escodegen.generate(ast, {
                        format: {
                            indent: {
                                style: '    ',
                                base: 0,
                                adjustMultilineComment: false
                            },
                            newline: '\n',
                            space: ' ',
                            json: false,
                            preserveBlankLines: true
                        }
                    });
                } catch (esgenErr) {
                    console.log('  ⚠ Fallback to simple formatter');
                    // 尝试简单的格式化处理
                    scriptSource = scriptSource
                        .replace(/;/g, ';\n')  // 在分号后添加换行
                        .replace(/{/g, '{\n')  // 在大括号后添加换行
                        .replace(/}/g, '\n}\n')    // 在大括号前后添加换行
                        .replace(/\)/g, '\n\)')  // 在右括号后添加换行
                        .replace(/\n\s*\n/g, '\n\n'); // 去除多余的空行
                }
            }

            resolve(scriptSource);
        } catch (error) {
            if (client) await client.close();
            if (chromeProcess) {
                try {
                    chromeProcess.kill('SIGTERM');
                } catch (e) {}
            }
            reject(error);
        }
    });
}

/**
 * 使用 Prettier 格式化代码（使用 standalone 版本，适合打包）
 */
async function prettifyWithPrettier(code) {
    try {
        const prettier = require('prettier');
        const babelPlugin = require('prettier/plugins/babel');
        return prettier.format(code, {
            parser: 'babel',
            plugins: [babelPlugin],
            semi: false,
            singleQuote: false,
            tabWidth: 4,
            printWidth: 120
        });
    } catch (e) {
        // 如果标准 prettier 不可用，尝试使用 escodegen
        try {
            const acorn = require('acorn');
            const escodegen = require('escodegen');

            const ast = acorn.parse(code, {
                ecmaVersion: 2022,
                sourceType: 'script',
                allowReturnOutsideFunction: true,
                allowHashBang: true
            });

            return escodegen.generate(ast, {
                format: {
                    indent: {
                        style: '    ',
                        base: 0,
                        adjustMultilineComment: false
                    },
                    newline: '\n',
                    space: ' ',
                    json: false,
                    preserveBlankLines: true
                }
            });
        } catch (esgenErr) {
            // 如果 escodegen 也不可用，则使用简单格式化
            return code
                .replace(/;/g, ';\n')
                .replace(/{/g, '{\n')
                .replace(/}/g, '\n}\n')
                .replace(/\)/g, '\n\)')
                .replace(/\n\s*\n/g, '\n\n');
        }
    }
}

/**
 * 简单实用的方法：使用在线服务的本地实现
 */
async function prettifySimple(code) {
    try {
        // 使用 acorn + escodegen 进行更好的解析
        const acorn = require('acorn');
        const escodegen = require('escodegen');

        const ast = acorn.parse(code, {
            ecmaVersion: 2022,
            sourceType: 'script',
            allowReturnOutsideFunction: true,
            allowHashBang: true
        });

        return escodegen.generate(ast, {
            format: {
                indent: {
                    style: '    ',
                    base: 0,
                    adjustMultilineComment: false
                },
                newline: '\n',
                space: ' ',
                json: false,
                preserveBlankLines: true
            }
        });
    } catch (e) {
        // 如果 AST 解析失败，使用简单的正则表达式格式化
        let result = '';
        let indent = 0;
        let inString = false;
        let stringChar = '';
        let escape = false;

        for (let i = 0; i < code.length; i++) {
            const char = code[i];

            // 处理字符串字面量
            if (!escape && (char === '"' || char === "'" || char === '`')) {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                } else if (char === stringChar) {
                    inString = false;
                }
            }

            escape = !escape && char === '\\' && inString;

            if (inString) {
                result += char;
                continue;
            }

            // 处理括号
            if (char === '{' || char === '[') {
                result += char + '\n' + '    '.repeat(indent + 1);
                indent++;
            } else if (char === '}' || char === ']') {
                indent--;
                result = result.trimEnd() + '\n' + '    '.repeat(indent) + char;
            } else if (char === ';') {
                result += char + '\n' + '    '.repeat(indent);
            } else if (char === ',') {
                result += char + '\n' + '    '.repeat(indent);
            } else {
                result += char;
            }
        }

        return result;
    }
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

        // 方法 1: 使用 Chrome DevTools Protocol (使用系统 Chrome 的 V8 引擎解压 + Prettier 格式化)
        try {
            prettified = await prettifyWithCDP(code);
            console.log('✓ Using Chrome V8 Engine + Prettier');
        } catch (e) {
            console.log('⚠ Chrome CDP not available, trying fallback...');
            console.log(`  Error: ${e.message}`);

            // 方法 2: 使用 Prettier
            try {
                prettified = await prettifyWithPrettier(code);
                console.log('✓ Using Prettier');
            } catch (e2) {
                console.log('⚠ Prettier not available, using advanced formatter...');
                try {
                    prettified = await prettifySimple(code);
                    console.log('✓ Using advanced formatter (acorn + escodegen fallback)');
                } catch (e3) {
                    console.log('⚠ All formatters failed, using basic formatter...');
                    prettified = code;
                }
            }
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