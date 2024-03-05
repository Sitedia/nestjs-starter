module.exports = {
  extends: '../../.eslintrc.js',
  overrides: [
    {
      files: ['*.ts'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
      ],
      parserOptions: { project: './tsconfig.json' },
    },
  ],
};
