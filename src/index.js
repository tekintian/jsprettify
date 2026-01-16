#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const prettier = require('prettier');
// // 引入所需模块（child_process 包含 exec 和 spawn）
// const { exec, spawn } = require('child_process');

/**
 * 检测目标环境是否存在 Node.js 可执行文件（跨平台兼容）
 * @returns {Promise<boolean>} - true 表示存在 Node，false 表示不存在
 */
// function checkNodeExists() {
//     return new Promise((resolve) => {
//         // 执行 node -v 命令：仅获取版本号，不执行复杂操作，效率高
//         // windows 下自动兼容 node.exe，无需额外处理
//         const command = 'node -v';
        
//         exec(command, (error, stdout, stderr) => {
//             // 无错误 + 有标准输出（版本号）→ 说明存在 Node 环境
//             if (!error && stdout) {
//                 resolve(true);
//             } else {
//                 // 有错误或无输出 → 不存在 Node 环境
//                 resolve(false);
//             }
//         });
//     });
// }

/**
 * 使用 Prettier 格式化代码
 */
async function prettifyWithPrettier(code) {
    return new Promise((resolve, reject) => {
        try {
            const formattedCode = prettier.format(code, {
                parser: 'babel',
                semi: false,
                singleQuote: false,
                tabWidth: 4,
                printWidth: 120
            });
            resolve(formattedCode);
        } catch (e) {
            reject(e);
        }
    });
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
        console.log('  jsprettify test.min.js bg_prettified.js');
        console.log('  jsprettify ct.min.js ct_prettified.js');
        console.log('');
        console.log('Note: If running with Node.js directly, use:');
        console.log('  node src/index.js <input.js> [output.js]');
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

        try {
            prettified = await prettifyWithPrettier(code);
            console.log('✓ Using Prettier');
        } catch (e) {
            console.log('⚠ Prettier not available, prettifying failed');
            throw new Error(`Prettier 格式化失败：${e.message}`);
        }

        const elapsed = Date.now() - startTime;
        console.log(`Time: ${elapsed}ms`);

        // 写入输出文件
        fs.writeFileSync(outputFile, prettified);
        console.log(`✓ Written to: ${outputFile}`);

        // ******** 新增：Node 环境检测 + 条件执行语法验证 ********
        // console.log('Checking Node.js environment for syntax validation...');
        // const hasNode = await checkNodeExists();

        // if (hasNode) {
        //     console.log('✓ Node.js found, performing syntax check...');
        //     // 存在 Node 环境，执行语法验证
        //     const nodeCheck = spawn('node', ['--check', outputFile]);

        //     nodeCheck.on('close', (code) => {
        //         if (code === 0) {
        //             console.log('✓ Syntax check passed');
        //         } else {
        //             console.log('⚠ Syntax check failed (but file written)');
        //         }
        //     });
        // } else {
        //     // 不存在 Node 环境，跳过语法验证，打印友好提示
        //     console.log('ℹ Node.js not found in environment, skipping syntax check.');
        // }

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

// 运行主函数
main().catch(console.error);