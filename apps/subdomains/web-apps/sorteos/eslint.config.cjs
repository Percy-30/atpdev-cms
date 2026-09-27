// Sorteos Pro — eslint config por Workspace (Next.js 16 App Router + TS).
// ESLint v9 flat config (CommonJS), sin usar el preset de eslint-config-next
// para evitar que la estructura del preset rompa el arranque de ESLint.
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = [
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: [
      'node_modules',
      '.next',
      'out',
      'build',
      'public/build',
      'src/lib/__tests__/coverage',
      'scripts/db-up.ts',
      'scripts/db-migrate.ts',
      'scripts/db-seed.ts',
      'dist',
      '*.tsbuildinfo',
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { vars: 'local', args: 'none', ignoreRestSiblings: true, argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'no-var': 'error',
      '@next/next/no-img-element': 'off',
      '@next/next/no-page-custom-font': 'off',
      'no-console': 'off',
    },
  },
];
