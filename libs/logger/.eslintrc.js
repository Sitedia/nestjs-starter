/* Copyright (C) 2024 My company - All Rights Reserved */
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
