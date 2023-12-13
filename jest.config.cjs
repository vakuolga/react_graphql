module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    '/node_modules/(?!(react-dnd)/)'
  ],
  moduleNameMapper: {
    'react-dnd-test-utils': 'react-dnd-test-backend',
  },
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
      isolatedModules: true,
    },
  },
};