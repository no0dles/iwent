module.exports = {
    "collectCoverage": true,
    coverageDirectory: "<rootDir>/coverage/",
    "collectCoverageFrom": [
        "<rootDir>/packages/*/src/**/*.ts",
        "**/node_modules/@iwent/**",
        "src/**"
    ],
    "coverageReporters": [
        "json",
        "lcov",
        "html"
    ],
    roots: [
        'packages/'
    ],
    "moduleFileExtensions": [
        "ts",
        "js"
    ],
    moduleNameMapper: {
        "@iwent/core": "<rootDir>/packages/core/src",
        "@iwent/web": "<rootDir>/packages/web/src",
        "@iwent/server": "<rootDir>/packages/server/src",
        "@iwent/example": "<rootDir>/packages/example/src"
    },
    "transform": {
        "^.+\\.ts$": "ts-jest"
    },
    "testRegex": "src/.*.spec.ts"
};