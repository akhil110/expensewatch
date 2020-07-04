module.exports = {
	"preset": "jest-preset-angular",
	"setupFilesAfterEnv": [
			"<rootDir>/setupJest.ts"
	],
	"transformIgnorePatterns": [
			"node_modules/(?!@ngrx|ngx-socket-io)" // Last any packages here that error
	],
	"transform": {
			"^.+\\.(ts|js|html)$": "ts-jest"
	},
	"testPathIgnorePatterns": [
			"<rootDir>/node_modules/",
			"<rootDir>/dist/",
			"<rootDir>/cypress/",
			"<rootDir>/src/test.ts",
	]
};
