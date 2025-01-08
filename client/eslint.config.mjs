import globals from 'globals';
import { fixupConfigRules } from '@eslint/compat';
import jsLint from '@eslint/js';
import tsLint from 'typescript-eslint';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import stylistic from '@stylistic/eslint-plugin';

export default [
  {
    files: ['**/*.{ts,tsx}']
  },
  {
    languageOptions: {
      // common parser options, enable TypeScript and JSX
      parser: '@typescript-eslint/parser',
      parserOptions: {
        sourceType: 'module'
      }
    }
  },
  {
    ignores: [
      '**/__test__/*',
      '**/assets/*',
      '**/*.scss',
      '**/*.css',
      '**/*.svg'
    ]
  },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    }
  },
  {
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', ',ts', '.tsx']
        }
      },
      'react': {
        pragma: 'React',
        fragment: 'Fragment',
        version: '18.3'
      }
    }
  },
  // syntax rules
  jsLint.configs.recommended,
  ...tsLint.configs.recommended,
  ...fixupConfigRules(pluginReactConfig),
  // code style rules
  stylistic.configs['disable-legacy'],
  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: true,
    commaDangle: 'never',
    jsx: true
  })
];
