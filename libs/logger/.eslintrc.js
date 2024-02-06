module.exports = {
  extends: '../../.eslintrc.base.js',
  overrides: [
    {
      files: ['*.ts'],
      extends: ['plugin:@typescript-eslint/recommended', 'plugin:import/recommended'],
      parserOptions: { project: './tsconfig.json' },
    },
  ],
};
