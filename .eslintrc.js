module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/strict',
    'plugin:jest/all',
    'plugin:unicorn/all',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['coverage/*', 'dist/*', '.eslintrc.js', 'prettier.config.js', 'jest.config.js', 'dotenv.config.js'],
  settings: { 'import/resolver': { typescript: true, node: true } },
  rules: {
    curly: 'error',
    eqeqeq: 'error',
    camelcase: 'error',
    complexity: ['error', 8],
    radix: 'error',
    'max-depth': ['error', 4],
    'no-console': 'warn',
    'max-statements': ['error', 30],
    'max-statements-per-line': ['error', { max: 2 }],
    'max-params': ['error', 8],
    'no-useless-escape': 'error',
    'no-magic-numbers': ['error', { ignore: [0, 1] }],
    'unicorn/prevent-abbreviations': ['error', { ignore: ['e2e', 'props'] }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/*.test.ts', '**/*.e2e-test.ts'] }],
    '@typescript-eslint/no-extraneous-class': ['error', { allowEmpty: true }],
  },
  overrides: [
    {
      files: ['*.ts'],
      extends: ['plugin:@typescript-eslint/strict', 'plugin:import/recommended'],
      parserOptions: { project: './tsconfig.json' }, // looks for tsconfig.json the folder from which the linter is executed
    },
    {
      files: ['*.test.ts', '*.e2e-test.ts'],
      rules: {
        'no-magic-numbers': 'off',
        'max-lines-per-function': 'off',
      },
    },
  ],
};
