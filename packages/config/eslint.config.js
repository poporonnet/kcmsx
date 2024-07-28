import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typeScriptESLint from "@typescript-eslint/eslint-plugin";
import typeScriptESLintParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";
import vitest from "eslint-plugin-vitest";

const compat = new FlatCompat();

/** @type {import("eslint").Linter.Config} */
export default [
  {
    files: ["config.ts", "*/**/*.ts"],
  },
  {
    ignores: ["coverage/**", "node_modules/**"],
  },
  js.configs.recommended,
  eslintConfigPrettier,
  ...compat.extends("plugin:@typescript-eslint/recommended"),
  {
    languageOptions: {
      parser: typeScriptESLintParser,
    },
  },
  {
    plugins: {
      "@typescript-eslint": typeScriptESLint,
      vitest,
    },
  },
  {
    rules: {
      ...vitest.configs.recommended.rules,
    },
  },
];
