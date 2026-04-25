module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@tile-generator/common$": "<rootDir>/../common/src",
  },
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
};
