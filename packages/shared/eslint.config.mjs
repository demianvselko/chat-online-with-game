import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended, prettier],
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  }
);