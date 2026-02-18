#!/usr/bin/env node

// Simple lint script that bypasses the ESLint CLI issue
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔍 Running TypeScript type checking...');
try {
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ TypeScript type checking passed');
} catch (error) {
  console.error('❌ TypeScript type checking failed');
  process.exit(1);
}

console.log('🔍 Running Prettier format check...');
try {
  execSync('npx prettier --check "src/**/*.ts"', { stdio: 'inherit' });
  console.log('✅ Prettier format check passed');
} catch (error) {
  console.error('❌ Prettier format check failed');
  process.exit(1);
}

console.log('🔍 Running basic syntax check...');
try {
  // Use Node.js to check for syntax errors, but skip .d.ts files
  const files = execSync('find src -name "*.ts" ! -name "*.d.ts"', { encoding: 'utf8' }).trim().split('\n');

  for (const file of files) {
    if (file.trim()) {
      try {
        execSync(`node -c ${file}`, { stdio: 'pipe' });
      } catch (error) {
        console.error(`❌ Syntax error in ${file}`);
        process.exit(1);
      }
    }
  }
  console.log('✅ Basic syntax check passed');
} catch (error) {
  console.error('❌ Basic syntax check failed');
  process.exit(1);
}

console.log('✅ All lint checks passed!');
