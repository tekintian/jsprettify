#!/bin/bash

# rm -rf node_modules/ package-lock.json
# npm i

echo "🔨 Starting Build JSPrettify..."

# Clean previous build and test output
rm -rf dist/ test_output.js

# Build the main executable with ncc - using the original command that worked
npx @vercel/ncc build src/index.js -o dist --minify

# Make the output executable and rename to remove the .js extension
chmod +x dist/index.js
mv dist/index.js dist/jsprettify

# Copy run scripts to dist directory
cp run-unix.sh dist/
cp run-windows.ps1 dist/

# Make all scripts executable
chmod +x dist/jsprettify dist/run-unix.sh

# Test the executable
./dist/jsprettify test_data/test.min.js test_output.js

# Verify the output
if [ -f test_output.js ]; then
    echo "Build and test successful!"
    echo "Files in dist/:"
    ls -la dist/
else
    echo "Test failed!"
    exit 1
fi