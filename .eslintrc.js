module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true
  },
  extends: ['eslint:recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    // Core consistency rules
    'no-console': 'warn',
    'no-debugger': 'error',
    // TypeScript rules
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',

    // Code quality rules
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-destructuring': ['error', { object: true, array: false }],

    // Security rules
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',

    // Best practices
    eqeqeq: ['error', 'always'],
    'no-else-return': 'error',
    'no-empty-function': 'warn',
    'no-magic-numbers': ['warn', { ignore: [-1, 0, 1, 2, 100, 1000] }],
    'no-return-await': 'error',
    'no-throw-literal': 'error',
    'prefer-promise-reject-errors': 'error',

    // Style rules (handled by Prettier)
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'always'],
    'comma-dangle': ['error', 'never']
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off'
      }
    },
    {
      files: ['*.ts'],
      rules: {
        '@typescript-eslint/no-var-requires': 'error'
      }
    },
    {
      files: ['scripts/**/*.js', 'scripts/**/*.sh'],
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ],
  ignorePatterns: ['node_modules/', 'dist/', 'build/', 'coverage/', '*.min.js', '!.eslintrc.js']
};
