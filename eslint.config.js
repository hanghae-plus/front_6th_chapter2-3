// eslint.config.js
import js from "@eslint/js"
import perfectionist from "eslint-plugin-perfectionist"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended, perfectionist.configs["recommended-natural"]],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      // ... 기존 규칙들

      // Perfectionist 규칙 커스터마이징
      "perfectionist/sort-imports": [
        "error",
        {
          type: "natural",
          order: "asc",
          groups: [
            "builtin",
            "external",
            "internal-type",
            "internal",
            ["parent-type", "sibling-type", "index-type"],
            ["parent", "sibling", "index"],
            "object",
            "unknown",
          ],
          customGroups: {
            value: {
              "react": ["^react$", "^react-.+"],
              "@app": "^@/app",
              "@pages": "^@/pages",
              "@widgets": "^@/widgets",
              "@features": "^@/features",
              "@entities": "^@/entities",
              "@shared": "^@/shared",
            },
          },
          newlinesBetween: "always",
        },
      ],
      "perfectionist/sort-named-imports": ["error", { type: "natural" }],
      "perfectionist/sort-exports": ["error", { type: "natural" }],
      "perfectionist/sort-object-types": ["error", { type: "natural" }],
      "perfectionist/sort-interfaces": ["error", { type: "natural" }],
      "perfectionist/sort-jsx-props": ["error", { type: "natural" }],
    },
  },
)
