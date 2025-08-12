import js from '@eslint/js';
import fsdPlugin from 'eslint-plugin-fsd-lint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx,css}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'fsd': fsdPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Enforces FSD layer import rules (e.g., features cannot import pages)
      'fsd/forbidden-imports': 'error',

      // Disallows relative imports between slices/layers, use aliases (@)
      // Allows relative imports within the same slice by default (configurable)
      'fsd/no-relative-imports': [
        'error',
        {
          allowSameSlice: true,
        },
      ],

      // Enforces importing only via public API (index files)
      'fsd/no-public-api-sidestep': 'error',

      // Prevents direct imports between slices in the same layer
      'fsd/no-cross-slice-dependency': 'error',

      // Prevents UI imports in business logic layers (e.g., entities)
      'fsd/no-ui-in-business-logic': 'error',

      // Forbids direct import of the global store
      'fsd/no-global-store-imports': 'error',

      // Enforces import order based on FSD layers
      'fsd/ordered-imports': 'warn',

      'import/order': 'off',
      'sort-imports': 'off',
    },
  },
);
