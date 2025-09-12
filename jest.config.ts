import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setup.jest.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/'
  ],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@app/(.*)$': '<rootDir>/src/app/$1'
  },
  transform: {
    '^.+\\.(ts|js|mjs|cjs)x?$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.html$'
      }
    ]
  },
  testRegex: '.*\\.spec\\.ts$',
  testEnvironment: 'jsdom',
};

export default config;
