const sharedConfig = require('../../jest.base.js');

module.exports = {
  ...sharedConfig,
  rootDir: './',
  setupFiles: ['./dotenv.config.ts'],
};
