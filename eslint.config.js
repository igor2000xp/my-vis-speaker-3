import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import angular from '@angular-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  // JS rules
  js.configs.recommended,
  // Angular & TS for .ts files
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        ecmaVersion: 2022,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      '@angular-eslint': angular,
      'prettier': prettierPlugin,
    },
    rules: {
      ...typescriptEslint.configs.recommended.rules,
      ...angular.configs['recommended'].rules,
      'prettier/prettier': 'error',
    },
  },
  // Prettier disables conflicting stylistic rules
  prettierConfig,
];
