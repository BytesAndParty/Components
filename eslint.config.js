import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import eslintPluginAstro from 'eslint-plugin-astro'
import tanstackQuery from '@tanstack/eslint-plugin-query'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'

export default defineConfig(
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/node_modules/**',
      '**/.astro/**',
      '**/.vite/**',
      '**/_public_/**',
      '**/_resources_/**',
      // TODO: re-enable once the vendure-showcase server cleanup
      // (seed.ts brace mismatch, redeclared wines, prefer-const lets)
      // is done. Tracked in ESLINT-MIGRATION.md §7.
      '**/vendure-showcase/server/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat['recommended-latest'],
  eslintPluginAstro.configs.recommended,
  ...tanstackQuery.configs['flat/recommended'],
  jsxA11y.flatConfigs.recommended,

  {
    files: ['**/*.astro'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.astro'],
        sourceType: 'module',
      },
    },
  },

  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      'react-refresh': reactRefresh,
      'unused-imports': unusedImports,
    },
    rules: {
      'react-refresh/only-export-components': ['warn', {
        allowConstantExport: true,
        extraHOCs: ['createLottieIcon'],
      }],

      // Unused imports cleanup
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // One capability → one library. Prevents two deps owning the same job
      // (e.g. urql + TanStack Query both caching). See ARTELIER.md §6.
      'no-restricted-imports': [
        'warn',
        {
          paths: [
            {
              name: 'react',
              importNames: ['useMemo', 'useCallback'],
              message: 'AtelierUI uses the React Compiler. Manual memoization (useMemo/useCallback) is discouraged unless required by external libraries.',
            },
            {
              name: 'urql',
              message: 'Server-state caching belongs to TanStack Query; GraphQL transport via graphql-request. No second cache layer.',
            },
            {
              name: '@urql/core',
              message: 'See urql — use TanStack Query (cache) + graphql-request (transport).',
            },
            {
              name: 'framer-motion',
              message: 'Use motion/react (framer-motion was renamed in v12).',
            },
          ],
          patterns: [
            {
              group: ['@radix-ui/*', '@headlessui/*'],
              message: 'Headless UI foundation is Ark UI (@ark-ui/react). Do not add a second headless library.',
            },
          ],
        },
      ],

      // typescript-eslint tweaks
      '@typescript-eslint/no-unused-vars': 'off', // Handled by unused-imports
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // Config files run in Node — relax browser-isms.
  {
    files: ['**/*.config.{js,ts,mjs,cjs}', '**/vite.config.*'],
    languageOptions: { globals: globals.node },
  },

  // Standalone Node scripts (build orchestration etc.) — Node globals.
  {
    files: ['scripts/**/*.{js,mjs,cjs}'],
    languageOptions: { globals: globals.node },
  },
)
