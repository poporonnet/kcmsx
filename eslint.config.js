import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import typeScriptESLint from '@typescript-eslint/eslint-plugin';
import typeScriptESLintParser from '@typescript-eslint/parser';
import { FlatCompat } from '@eslint/eslintrc';
import vitest from 'eslint-plugin-vitest';

const compat = new FlatCompat();

export default [
  {
    // 対象ファイル
    files: ['src/**/**.ts'],
  },
  {
    // 除外ファイル
    ignores: ['build/**', 'coverage/**', 'node_modules/**'],
  },
  // eslint:recommended
  js.configs.recommended,
  // prettierと競合する部分を抑制
  eslintConfigPrettier,
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  {
    languageOptions: {
      parser: typeScriptESLintParser,
      globals: {
        ...vitest.environments.env.globals
      }
    },
  },
  // TSパーサー
  {
    plugins: {
      '@typescript-eslint': typeScriptESLint,
      'vitest': vitest
    },
  },
  // プラグインの設定
  {
    rules: {
      ...vitest.configs.recommended.rules,
      "vitest/consistent-test-it": ["error", {"fn": "it"}],
      "vitest/require-top-level-describe": ["error"],
    },
  },
];
