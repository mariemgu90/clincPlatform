import globals from 'globals';
import js from '@eslint/js';
import react from 'eslint-plugin-react';

export default [
  js.configs.recommended,
  {
    files: ['**/*.jsx', '**/*.js'],
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
    },
    rules: {
      // Detect and report all unused variables (properly handles JSX)
      'no-unused-vars': ['error', {
        // vars: 'all',
        // varsIgnorePattern: '^_',
        // args: 'all',
        // argsIgnorePattern: '^_',
        // caughtErrors: 'all',
        // caughtErrorsIgnorePattern: '^_',
      }],
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'quotes': ['warn', 'single'],
      'semi': ['warn', 'always'],
    },
  },
];