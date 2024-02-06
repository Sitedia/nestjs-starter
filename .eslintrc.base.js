module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:jest/all', 'plugin:unicorn/all'],
  ignorePatterns: ['.eslintrc.js', 'prettier.config.js', 'jest.config.js', 'dotenv.config.ts'],
  settings: { 'import/resolver': { typescript: true, node: true } },
  rules: {
    curly: 'error',
    eqeqeq: 'error',
    'unicorn/prevent-abbreviations': ['error', { ignore: ['e2e', 'props'] }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/*.test.ts', '**/*.e2e-test.ts'] }],
  },
};
