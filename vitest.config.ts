import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./vitest.setup.ts'],
        include: ['src/**/*.test.{ts,tsx}'],
        coverage: {
            provider: 'v8', // Using v8 due to istanbul provider bug: "Coverage must be initialized with a path or an object"
            // Bug occurs in getCoverageMapForUncoveredFiles when processing uncovered files
            // Issue: @vitest/coverage-istanbul@4.0.17 has bug with undefined file paths
            reporter: ['text', 'html', 'json'],
            include: ['src/**/*.{ts,tsx}'],
            exclude: [
                'node_modules/**',
                '**/*.d.ts',
                '**/*.config.{js,ts,mjs}',
                'vitest.setup.ts',
                // Next.js pages (better tested with E2E)
                'src/pages/**',
                // API routes (separate testing strategy)
                'src/pages/api/**',
                // Type definitions
                'src/types/**',
                // Appwrite client wrappers (mostly config)
                'src/lib/appwriteClient.ts',
                'src/lib/appwriteServer.ts',
                // Mock implementations (tested through integration)
                'src/lib/mockAppwriteClient.ts',
                'src/lib/mockData.ts',
                // Schema definitions (pure Yup schemas)
                'src/validation/*Schema.ts',
                // Constants (pure data exports)
                'src/lib/constants/**',
            ],
            thresholds: {
                lines: 80,
                functions: 80,
                branches: 80,
                statements: 80,
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
