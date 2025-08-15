import js from "@eslint/js"
import boundaries from "eslint-plugin-boundaries"
import importPlugin from "eslint-plugin-import"
import perfectionist from "eslint-plugin-perfectionist"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import globals from "globals"
import { dirname, resolve } from "path"
import tseslint from "typescript-eslint"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "boundaries": boundaries,
      "import": importPlugin,
      "perfectionist": perfectionist,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              from: "app",
              allow: ["app", "pages", "widgets", "features", "entities", "shared"],
            },
            {
              from: "pages",
              allow: ["pages", "widgets", "features", "entities", "shared"],
            },
            {
              from: "widgets",
              allow: ["widgets", "features", "entities", "shared"],
            },
            {
              from: "features",
              allow: ["features", "entities", "shared"],
            },
            {
              from: "entities",
              allow: ["entities", "shared"],
            },
            {
              from: "shared",
              allow: ["shared"],
            },
          ],
        },
      ],
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

          newlinesBetween: "always",
        },
      ],
      "perfectionist/sort-named-imports": ["error", { type: "natural" }],
      "perfectionist/sort-exports": ["error", { type: "natural" }],
      "perfectionist/sort-object-types": ["error", { type: "natural" }],
      "perfectionist/sort-interfaces": ["error", { type: "natural" }],
      "perfectionist/sort-jsx-props": ["error", { type: "natural" }],
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: resolve(__dirname, "tsconfig.app.json"),
        },
      },
      "boundaries": {
        allowed: [
          {
            name: "app",
            pattern: "src/app/**",
            mode: "folder",
          },
          {
            name: "pages",
            pattern: "src/pages/**",
            mode: "folder",
          },
          {
            name: "widgets",
            pattern: "src/widgets/**",
            mode: "folder",
          },
          {
            name: "features",
            pattern: "src/features/**",
            mode: "folder",
          },
          {
            name: "entities",
            pattern: "src/entities/**",
            mode: "folder",
          },
          {
            name: "shared",
            pattern: "src/shared/**",
            mode: "folder",
          },
        ],
        elements: [
          {
            name: "app",
            pattern: "src/app/**",
            mode: "folder",
          },
          {
            name: "pages",
            pattern: "src/pages/**",
            mode: "folder",
          },
          {
            name: "widgets",
            pattern: "src/widgets/**",
            mode: "folder",
          },
          {
            name: "features",
            pattern: "src/features/**",
            mode: "folder",
          },
          {
            name: "entities",
            pattern: "src/entities/**",
            mode: "folder",
          },
          {
            name: "shared",
            pattern: "src/shared/**",
            mode: "folder",
          },
        ],
      },
    },
  },
)
