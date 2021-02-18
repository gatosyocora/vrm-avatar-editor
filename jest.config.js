module.exports = {
    verbose: true,
    moduleFileExtensions: [
      "js",
      "ts",
      "json",
      "vue"
    ],
    moduleNameMapper: {
      "^@/(.+)": "<rootDir>/src/$1"
    },
    transform: {
      ".*\\.(vue)$": "vue-jest",
      "^.+\\.ts$": "babel-jest",
      "^.+\\.js$": "babel-jest"
    },
    transformIgnorePatterns: ['node_modules/(?!three).+\\.js$'],
    globals: {
      "ts-jest": {
        "tsconfig": "tsconfig.json"
      }
    },
    testURL: "http://localhost",
    testMatch: [
      "**/tests/**/*.test.ts"
    ]
}
