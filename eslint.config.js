import js from "@eslint/js"
import importPlugin from "eslint-plugin-import"
import simpleImportSort from "eslint-plugin-simple-import-sort"

import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "import": importPlugin,
      "simple-import-sort": simpleImportSort,

      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],


      // TypeScript preferences
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      
      // 코드 스타일 규칙 (자동수정 가능하도록 구성)
      "semi": ["error", "never"],
      "quotes": ["error", "double"],
      "indent": ["error", 2],
      "eol-last": ["error", "always"],
      "no-trailing-spaces": ["error"],
      "no-multi-spaces": ["error"],
      "comma-spacing": ["error", { before: false, after: true }],
      "keyword-spacing": ["error", { before: true, after: true }],
      "space-before-blocks": ["error", "always"],
      "space-infix-ops": ["error"],
      "arrow-spacing": ["error", { before: true, after: true }],
      "block-spacing": ["error", "always"],
      "object-curly-newline": ["error", { "multiline": true, "consistent": true }],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "space-in-parens": ["error", "never"],
      "jsx-quotes": ["error", "prefer-double"],
      "arrow-parens": ["error", "always"],
      "max-len": [
        "warn",
        {
          "code": 120,
          "ignoreStrings": true,
          "ignoreTemplateLiterals": true,
          "ignoreRegExpLiterals": true,
          "ignoreUrls": true,
          "ignoreComments": true,
        }
      ],
      "comma-dangle": ["error", "always-multiline"],

      // FSD layer restrictions (custom rules) - warnings only for gradual adoption
      "no-restricted-imports": [
        "warn",
        {
          patterns: [
            // Core layer can import everything, but nothing should import core except views
            {
              group: ["**/entities/**"],
              importNames: ["default"],
              message: "Consider using public API from entities index.ts instead of direct imports",
            },
          ],
        },
      ],

      // Import sort: 외부(서드파티) → 한 줄 공백 → 앱 내부(FSD 경로 순)
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // 1) Node 내장 + 외부(react, react-dom 등)
            [
              // Node builtins
              "^node:(.*)$",
              // external packages
              "^@?\w",
            ],
            // 공백 한 줄
            ["^\u0000"],
            // 2) 내부 alias: FSD 레이어 순서
            [
              "^@/core(/.*)?$",
              "^@/shared(/.*)?$",
              "^@/entities(/.*)?$",
              "^@/features(/.*)?$",
              "^@/widgets(/.*)?$",
              "^@/views(/.*)?$",
            ],
            // 3) 상대 경로
            [
              "^\.\.(?:/|$)",
              "^\./(?!.*\u0000)",
              "^\./$",
            ],
            // 4) 스타일 파일
            ["^.+\\.(css|scss|sass|less|styl)$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
    },
  },
)
