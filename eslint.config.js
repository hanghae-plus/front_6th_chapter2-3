import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"
import importPlugin from "eslint-plugin-import"
import boundaries from "eslint-plugin-boundaries"

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
      "import": importPlugin,
      boundaries,
    },
    settings: {
      "import/resolver": {
        typescript: { project: ["./tsconfig.app.json"] },
        alias: {
          map: [
            ["@", "./src"],
            ["@app", "./src/app"],
            ["@pages", "./src/pages"],
            ["@widgets", "./src/widgets"],
            ["@features", "./src/features"],
            ["@entities", "./src/entities"],
            ["@shared", "./src/shared"],
          ],
          extensions: [".ts", ".tsx", ".js", ".jsx"],
        },
      },
      "boundaries/elements": [
        { type: "app", pattern: "src/app/**" },
        { type: "pages", pattern: "src/pages/**" },
        { type: "widgets", pattern: "src/widgets/**" },
        { type: "features", pattern: "src/features/**" },
        { type: "entities", pattern: "src/entities/**" },
        { type: "shared", pattern: "src/shared/**" },
      ],
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      "import/order": [
        "warn",
        {
          "groups": ["builtin", "external", "internal", "parent", "sibling", "index", "type"],
          "pathGroups": [
            { pattern: "@{app,pages,widgets,features,entities,shared}/**", group: "internal", position: "before" },
            { pattern: "@/**", group: "internal", position: "before" },
          ],
          "pathGroupsExcludedImportTypes": ["builtin"],
          "alphabetize": { order: "asc", caseInsensitive: true },
          "newlines-between": "always",
        },
      ],

      "boundaries/no-unknown": "error",
      "boundaries/allowed-types": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: "app", allow: ["pages", "widgets", "features", "entities", "shared"] },
            { from: "pages", allow: ["widgets", "features", "entities", "shared"] },
            { from: "widgets", allow: ["features", "entities", "shared"] },
            { from: "features", allow: ["entities", "shared"] },
            { from: "entities", allow: ["shared"] },
            { from: "shared", allow: [] },
          ],
        },
      ],
    },
  },
)
