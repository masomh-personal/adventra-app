import nextPlugin from 'eslint-config-next';
import vitest from 'eslint-plugin-vitest';

const eslintConfig = [
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'coverage/**', 'public/**'],
  },
  ...nextPlugin,
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-img-element': 'off',
    },
  },
  {
    files: ['**/*.{test,spec}.{ts,tsx}', 'tests/**/*.{ts,tsx}', 'vitest.setup.ts'],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
    },
  },
];

export default eslintConfig;
