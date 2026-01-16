#!/usr/bin/env node

/**
 * JSPrettify Lite 版本
 * 仅使用 Prettier，不依赖 Chrome
 * 适用于不需要浏览器自动化的场景
 */

const fs = require('fs');
const path = require('path');

/**
 * 使用 Prettier 格式化代码
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
 * 简单格式化（备用方案）
 */
function prettifySimple(code) {
    try {
        const func = new Function(code);
        const funcStr = func.toString();
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
        console.log('JSPrettify Lite - 使用 Prettier 格式化 JavaScript');
        console.log('');
        console.log('Usage: jsprettify-lite <input.js> [output.js]');
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

        // 方法 1: 使用 Prettier
        try {
            prettified = await prettifyWithPrettier(code);
            console.log('✓ Using Prettier');
        } catch (e) {
            console.log('⚠ Prettier failed, using fallback...');
            prettified = prettifySimple(code);
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

main().catch(console.error);
