module.exports = {
  extends: '../../.eslintrc.js',
  overrides: [
    {
      files: ['*.ts'],
      extends: ['plugin:@typescript-eslint/strict', 'plugin:import/recommended'],
      parserOptions: { project: './tsconfig.json' },
    },
  ],
};
