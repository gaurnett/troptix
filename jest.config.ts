/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  //Run tests from one or more projects
  projects: [
    {
      displayName: 'web',
      testMatch: ['<rootDir>/apps/web/*'],
    },
    {
      displayName: 'server',
      testMatch: ['<rootDir>/apps/server/*'],
    },
    {
      displayName: 'organizer',
    },
  ],
};

export default config;
