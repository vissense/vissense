var fs = require('fs');

module.exports = function(config) {
	// Use ENV vars on Travis and sauce.json locally to get credentials
	if (!process.env.SAUCE_USERNAME) {
		if (!fs.existsSync('.sauce.json')) {
			console.log('Create a sauce.json with your credentials based on the sauce-sample.json file.');
			process.exit(1);
		} else {
			process.env.SAUCE_USERNAME = require('./.sauce').SAUCE_USERNAME;
			process.env.SAUCE_ACCESS_KEY = require('./.sauce').SAUCE_ACCESS_KEY;
		}
	}
	var customLaunchers = {
		/*sl_chrome: {
		  base: 'SauceLabs',
		  browserName: 'chrome',
		  platform: 'Windows 7',
		  version: '35'
		},
		sl_firefox: {
		  base: 'SauceLabs',
		  browserName: 'firefox',
		  version: '30'
		},
		sl_ios_safari: {
		  base: 'SauceLabs',
		  browserName: 'iphone',
		  platform: 'OS X 10.9',
		  version: '7.1'
		},*/
		sl_ie_11: {
		  base: 'SauceLabs',
		  browserName: 'internet explorer',
		  platform: 'Windows 8.1',
		  version: '11'
		}
	};
	config.set({

        // base path, that will be used to resolve files and exclude
        basePath: './',

        frameworks: ['jasmine'],

        files: [
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/lodash/dist/lodash.min.js',
            'bower_components/jasmine-jquery/lib/jasmine-jquery.js',
            'bower_components/jasmine-jsreporter/jasmine-jsreporter.js',

            'lib/vissense.js',

            'spec/**/*.js',

            // fixtures
            {pattern: 'spec/**/*.html', watched: true, served: true, included: false}
        ],
		
		reporters: ['dots', 'saucelabs'],
		
		port: 9876,
		
		colors: true,
		
		logLevel: config.LOG_INFO,
		
		captureTimeout: 120000,
		
		customLaunchers: customLaunchers,
		
		browsers: Object.keys(customLaunchers),
		
		singleRun: true,

		sauceLabs: {
			startConnect: true, 

			testName: 'VisSense.js',

			recordVideo: false,

			deviceOrientation: 'landscape',
			
			build: process.env.TRAVIS_BUILD_NUMBER || process.env.BUILD_NUMBER || 'none',
			
			tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER || undefined
		}

	});
};