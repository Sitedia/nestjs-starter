module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:jest/all', 'plugin:unicorn/all'],
  ignorePatterns: [
    '.eslintrc.js',
    'prettier.config.js',
    'jest.config.js',
    'dotenv.config.ts',
  ],
  settings: { 'import/resolver': { typescript: true, node: true } },
  rules: {
    curly: 'error',
    eqeqeq: 'error',
    camelcase: 'error',
    complexity: ['error', 8],
    'max-depth': ['error', 4],
    'no-console': 'warn',
    'max-statements': ['error', 15],
    'max-statements-per-line': ['error', { max: 2 }],
    'max-params': ['error', 8],
    'no-useless-escape': 'error',
    'no-magic-numbers': ['error', { ignore: [0, 1] }],
    'unicorn/prevent-abbreviations': ['error', { ignore: ['e2e', 'props'] }],
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.test.ts', '**/*.e2e-test.ts'] },
    ],
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.e2e-test.ts'],
      rules: {
        'no-magic-numbers': 'off',
        'max-lines-per-function': 'off',
      },
    },
  ],
};
