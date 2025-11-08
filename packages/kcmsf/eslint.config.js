import { fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typeScriptESLint from "@typescript-eslint/eslint-plugin";
import typeScriptESLintParser from "@typescript-eslint/parser";
import vitest from "@vitest/eslint-plugin";
import eslintConfigPrettier from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

const compat = new FlatCompat();

/** @type {import("eslint").Linter.Config} */
export default [
  {
    files: ["src/**/*.{ts,tsx}"],
  },
  {
    ignores: ["dist/**", "node_modules/**"],
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
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    plugins: {
      "@typescript-eslint": typeScriptESLint,
      "react-refresh": reactRefresh,
      "react-hooks": fixupPluginRules(reactHooks),
      vitest,
    },
  },
  {
    rules: {
      ...vitest.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
];
