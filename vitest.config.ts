import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Enable global test APIs (describe, it, expect, vi, etc.)
    environment: 'jsdom', // Use jsdom for DOM testing
    setupFiles: ['./vitest.setup.ts'],
    include: [
      'tests/**/*.{test,spec}.{ts,tsx}',
      'src/**/*.{test,spec}.{ts,tsx}',
    ],
    typecheck: {
      tsconfig: './tsconfig.json',
    },
    exclude: [
      'node_modules',
      '.next',
      'coverage',
      'dist',
    ],
    coverage: {
      provider: 'v8', // Uses Istanbul under the hood
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/vitest.setup.ts',
        'src/pages/_app.tsx',
        'src/pages/_document.tsx',
        'coverage/',
        '.next/',
      ],
      include: ['src/**/*.{ts,tsx}'],
      thresholds: {
        lines: 0, // Set your desired thresholds
        functions: 0,
        branches: 0,
        statements: 0,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
