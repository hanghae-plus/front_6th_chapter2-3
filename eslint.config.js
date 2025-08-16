import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'

export default [
  {
    ignores: ['dist', 'node_modules']
  },
  js.configs.recommended,
  prettier,
  {
    files: ['**/*.{js,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        window: 'readonly',
        document: 'readonly',
      }
    },
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'prettier/prettier': 'error'  // 이제 띄어쓰기도 ESLint 에러로 표시!
    }
  }
]