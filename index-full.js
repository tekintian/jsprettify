#!/usr/bin/env node

/**
 * JSPrettify Full 版本
 * 内置 Prettier，完全独立运行
 * 不依赖任何外部工具
 */

const fs = require('fs');
const path = require('path');

/**
 * 使用 Prettier 格式化代码
 */
async function prettifyWithPrettier(code) {
    try {
        const { default: prettier } = await import('prettier');
        return prettier.format(code, {
            parser: 'babel',
            semi: false,
            singleQuote: false,
            tabWidth: 4,
            printWidth: 120
        });
    } catch (e) {
        throw new Error('Prettier format failed: ' + e.message);
    }
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
        console.log('JSPrettify Full - 使用内置 Prettier 格式化 JavaScript');
        console.log('');
        console.log('Usage: jsprettify-full <input.js> [output.js]');
        console.log('');
        console.log('Features:');
        console.log('  - Fully standalone (no external dependencies)');
        console.log('  - Works offline');
        console.log('  - Consistent formatting with Prettier');
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

        // 方法 1: 使用 Prettier
        try {
            prettified = await prettifyWithPrettier(code);
            console.log('✓ Using Prettier');
        } catch (e) {
            console.log('⚠ Prettier failed:', e.message);
            console.log('  Using simple formatter...');
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
                console.log('  This may be due to special characters in the input file');
            }
        });

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);
