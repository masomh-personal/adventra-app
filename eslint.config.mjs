import nextPlugin from 'eslint-config-next';
import vitest from 'eslint-plugin-vitest';
import prettierConfig from 'eslint-config-prettier';

const eslintConfig = [
    {
        ignores: [
            'node_modules/**',
            '.next/**',
            'out/**',
            'coverage/**',
            'public/**',
            '*.config.{js,mjs,ts}',
            '.husky/**',
        ],
    },
    ...nextPlugin,
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        rules: {
            // React rules
            'react/no-unescaped-entities': 'off', // Allow quotes and apostrophes in JSX
            'react/react-in-jsx-scope': 'off', // Not needed with React 17+
            'react/prop-types': 'off', // TypeScript handles this

            // Next.js rules
            '@next/next/no-img-element': 'off', // Allow <img> when needed

            // TypeScript rules (already included by eslint-config-next, but we customize)
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-explicit-any': 'off', // TypeScript strict mode handles this
            '@typescript-eslint/explicit-function-return-type': 'off', // Too strict for React
            '@typescript-eslint/explicit-module-boundary-types': 'off', // Too strict for React
            '@typescript-eslint/no-non-null-assertion': 'warn', // Warn instead of error
            '@typescript-eslint/no-empty-object-type': 'off', // Allow empty interfaces/types

            // General code quality
            'no-console': ['warn', { allow: ['warn', 'error'] }], // Allow console.warn/error
            'prefer-const': 'error',
            'no-var': 'error',
        },
    },
    {
        files: ['**/*.{test,spec}.{ts,tsx}', 'tests/**/*.{ts,tsx}', 'vitest.setup.ts'],
        plugins: {
            vitest,
        },
        rules: {
            ...vitest.configs.recommended.rules,
            // Allow test files to have more flexible rules
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
            'no-console': 'off',
        },
    },
    prettierConfig,
];

export default eslintConfig;
