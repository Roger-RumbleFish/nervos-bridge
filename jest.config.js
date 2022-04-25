module.exports = {
  roots: ['./'],
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'ts-jest',
  },
  testRegex: `(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$`,
  moduleNameMapper: {
    '@api/(.*)': '<rootDir>/src/api/$1',
    '@contracts/(.*)': '<rootDir>/src/contracts/$1',
    '@hooks/(.*)': '<rootDir>/src/hooks/$1',
    '@interfaces/(.*)': '<rootDir>/src/interfaces/$1',
    '@utils/(.*)': '<rootDir>/src/utils/$1',
    '@config': '<rootDir>/src/config.ts',
    '.+\\.(css|styl|less|sass|scss)$': 'identity-obj-proxy',
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/file-mock.js',
  },
  coveragePathIgnorePatterns: ['<rootDir>/public/', '<rootDir>/testUtils/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['node_modules'],
  testURL: 'http://localhost',
  setupFilesAfterEnv: ['<rootDir>/setup-tests.ts'],
}
