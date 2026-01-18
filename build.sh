#!/bin/bash
# Build script for JSPrettify
# Author: tekintian@gmail.com (https://dev.tekin.cn)
# 
# Clean previous build and test output
rm -rf dist/ output.js

# Build the main executable with ncc
npx @vercel/ncc build src/index.js -o dist --minify

# Rename the output to remove the .js extension
mv dist/index.js dist/jsprettify

# Copy run scripts to dist directory
cp run-windows.ps1 dist/
# Make the PowerShell script executable
chmod +x dist/run-windows.ps1

# make the executable file in dist/ directory executable (Unix and macOS)
if [[ "$OSTYPE" == "linux-gnu"* || "$OSTYPE" == "darwin"* ]]; then
    # Make the executable file in dist/ directory executable
    chmod +x dist/jsprettify
    # Copy Unix run script to dist directory
    cp run-unix.sh dist/
    # Make the unix script executable
    chmod +x dist/run-unix.sh
fi

echo "Build completed successfully!"
echo "Files in dist/:"
ls -la dist/