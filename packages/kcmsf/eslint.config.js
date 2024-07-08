import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typeScriptESLint from "@typescript-eslint/eslint-plugin";
import typeScriptESLintParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";
import reactRefresh from "eslint-plugin-react-refresh";
import vitest from "eslint-plugin-vitest";
import globals from "globals";

const compat = new FlatCompat();

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
  ...compat.extends("plugin:react-hooks/recommended"),
  {
    languageOptions: {
      parser: typeScriptESLintParser,
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    plugins: {
      "@typescript-eslint": typeScriptESLint,
      "react-refresh": reactRefresh,
      vitest,
    },
  },
  {
    rules: {
      ...vitest.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
];
