const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.base.json');

module.exports = {
  testRegex: ['.*\\.test\\.ts$', '.*\\.e2e-test\\.ts$'],
  transform: { '^.+\\.[tj]sx?$': ['ts-jest'] },
  moduleFileExtensions: ['js', 'json', 'ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.e2e-test.ts',
    '!src/index.ts',
  ],
  coverageDirectory: './coverage',
  coverageThreshold: { global: { lines: 75 } },
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  modulePaths: [__dirname],
};
