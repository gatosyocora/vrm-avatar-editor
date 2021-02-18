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
      "^.+\\.ts$": "ts-jest",
      "^.+\\.js$": "babel-jest"
    },
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