module.exports = {
  roots: ['./'],
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.svg$': 'jest-svg-transformer',
  },
  testRegex: `(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$`,
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss)$': 'identity-obj-proxy',
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/file-mock.js',
  },
  coveragePathIgnorePatterns: ['<rootDir>/public/', '<rootDir>/testUtils/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['node_modules'],
  testURL: 'http://localhost',
  setupFilesAfterEnv: ['<rootDir>/setup-tests.ts'],
}
