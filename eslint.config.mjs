import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

/** @type {import("eslint").Linter.FlatConfig} */
export default [
  {
    files: ['**/*.ts', '**/*.js', '**/*.tsx', '**/*.jsx'],
    languageOptions: {
      parser: await import('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      prettier: eslintPluginPrettier,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // Prettier como regla
      'prettier/prettier': 'error',

      // Orden de imports automático
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // Buenas prácticas básicas
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      eqeqeq: ['error', 'always'],
      curly: 'error',
    },
  },
  // Desactiva reglas de ESLint que chocan con Prettier
  eslintConfigPrettier,
];
