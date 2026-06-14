import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  // Ignorés
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      '*.config.js',
      '*.config.mjs',
      'server.js',
    ],
  },

  // Base JS
  js.configs.recommended,

  // TypeScript (recommandé, non strict)
  ...tseslint.configs.recommended,

  // Astro
  ...astro.configs.recommended,

  // React pour .tsx
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
    },
  },

  // Règles globales assouplies pour ne pas bloquer le code existant
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-empty-object-type': 'off',
      'no-console': 'off',
      'no-undef': 'off',
    },
  },

  // Désactive les règles en conflit avec Prettier (toujours en dernier)
  prettier
);
