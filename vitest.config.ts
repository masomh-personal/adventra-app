import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true, // Enable global test APIs (describe, it, expect, vi, etc.)
        environment: 'jsdom', // Use jsdom for DOM testing
        setupFiles: ['./vitest.setup.ts'],
        include: ['tests/**/*.{test,spec}.{ts,tsx}', 'src/**/*.{test,spec}.{ts,tsx}'],
        typecheck: {
            tsconfig: './tsconfig.json',
        },
        exclude: ['node_modules', '.next', 'coverage', 'dist'],
        coverage: {
            provider: 'v8', // Native V8 coverage (faster, recommended by Vitest)
            reporter: ['text', 'json', 'html', 'lcov'],
            exclude: [
                'node_modules/',
                'tests/',
                '**/*.d.ts',
                '**/*.config.{js,ts,mjs}',
                '**/vitest.setup.ts',
                'src/pages/_app.tsx',
                'src/pages/_document.tsx',
                'src/pages/api/**', // API routes need integration tests, not unit tests
                'src/pages/auth/**', // OAuth callbacks, integration test territory
                'src/types/**/*.ts', // Type definitions only, no runtime code
                'src/lib/appwriteClient.ts', // Just creates client instance
                'src/lib/appwriteServer.ts', // Just creates server client instance
                'src/pages/edit-profile.tsx', // TODO: Complex page needs Supabase→Appwrite migration first
                'coverage/',
                '.next/',
            ],
            include: ['src/**/*.{ts,tsx}'],
            thresholds: {
                lines: 80, // Minimum 80% line coverage
                functions: 80, // Minimum 80% function coverage
                branches: 80, // Minimum 80% branch coverage
                statements: 80, // Minimum 80% statement coverage
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
