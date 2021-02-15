module.exports = {
    "verbose": true,
    "moduleFileExtensions": [
      "js",
      "ts",
      "json",
      "vue"
    ],
    "moduleNameMapper": {
      "^@/(.+)": "<rootDir>/src/$1"
    },
    "transform": {
      ".*\\.(vue)$": "<rootDir>/node_modules/vue-jest",
      "^.+\\.ts$": "<rootDir>/node_modules/ts-jest",
      "^.+\\.js$": "<rootDir>/node_modules/babel-jest"
    },
    "globals": {
      "ts-jest": {
        "tsConfig": "tsconfig.json"
      }
    },
    "testURL": "http://localhost",
    "testMatch": [
      "**/tests/**/*.test.ts"
    ]
}