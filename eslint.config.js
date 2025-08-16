// eslint.config.js
import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"
import eslintPluginImport from "eslint-plugin-import"

export default tseslint.config(
  {
    ignores: ["dist", "node_modules"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tseslint.parser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "import": eslintPluginImport,
    },
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      // import/order 규칙을 올바르게 수정합니다.
      "import/order": [
        "error",
        {
          groups: [
            "builtin", // Node.js 내장 모듈 (path, fs 등)
            "external", // 외부 패키지 (vite, react 등)
            "internal", // 프로젝트 내부 모듈 (FSD 레이어)
            ["parent", "sibling", "index"],
            "unknown",
          ],
          pathGroups: [
            // FSD 레이어 순서 정의 (shared -> entities -> features)
            {
              pattern: "@/app/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/pages/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/widgets/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/features/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/entities/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/shared/**",
              group: "internal",
              position: "after",
            },
          ],
        },
      ],
      "import/no-cycle": "error",
    },
  },
)
