import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typeScriptESLint from "@typescript-eslint/eslint-plugin";
import typeScriptESLintParser from "@typescript-eslint/parser";
import vitest from "@vitest/eslint-plugin";
import eslintConfigPrettier from "eslint-config-prettier";

const compat = new FlatCompat();

/** @type {import("eslint").Linter.Config} */
export default [
  {
    files: ["index.ts", "src/**/*.ts"],
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
      parserOptions: {
        projectService: true,
      },
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
  {
    settings: {
      vitest: {
        typecheck: true,
      },
    },
  },
];
