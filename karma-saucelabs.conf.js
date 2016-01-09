'use strict';

var fs = require('fs');

module.exports = function (config) {
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

  /**
   * Browser test combinations on SauceLabs
   * See https://saucelabs.com/platforms/ for all supported platforms.
   */
  var customLaunchers = {
    'SL_Android_5.0': {
      base: 'SauceLabs',
      browserName: 'Android',
      platform: 'Linux',
      version: '5.0'
    },
    'SL_Chrome_OSX': {
      base: 'SauceLabs',
      browserName: 'Chrome',
      platform: 'OS X 10.10'
    },
    'SL_Chrome_Win': {
      base: 'SauceLabs',
      browserName: 'Chrome',
      platform: 'Windows 8.1'
    },
    'SL_Chrome_Linux': {
      base: 'SauceLabs',
      browserName: 'Chrome',
      platform: 'Linux'
    },
    'SL_Firefox26_Linux': {
      base: 'SauceLabs',
      browserName: 'Firefox',
      platform: 'Linux',
      version: '26'
    },
    'SL_Firefox_Linux': {
      base: 'SauceLabs',
      browserName: 'Firefox',
      platform: 'Linux'
    },
    'SL_Firefox_Win': {
      base: 'SauceLabs',
      browserName: 'Firefox',
      platform: 'Windows 8.1',
      version: '34'
    },
    'SL_Firefox_OSX': {
      base: 'SauceLabs',
      browserName: 'Firefox',
      platform: 'OS X 10.10'
    },
    'SL_IE_9': {
      base: 'SauceLabs',
      browserName: 'Internet Explorer',
      platform: 'Windows 7',
      version: '9'
    },
    'SL_IE_10': {
      base: 'SauceLabs',
      browserName: 'Internet Explorer',
      platform: 'Windows 8',
      version: '10'
    },
    'SL_IE_11': {
      base: 'SauceLabs',
      browserName: 'Internet Explorer',
      platform: 'Windows 10',
      version: '11'
    },
    'SL_IE_EDGE': {
      base: 'SauceLabs',
      browserName: 'edge',
      platform: 'Windows 10'
    },
    'SL_IOS_8': {
      base: 'SauceLabs',
      browserName: 'iPhone',
      platform: 'OS X 10.10',
      version: '8.1'
    },
    /*'SL_Android_4.0': {
     base: 'SauceLabs',
     browserName: 'Android',
     platform: 'Linux',
     version: '4.0'
     },
     'SL_Android_4.1': {
     base: 'SauceLabs',
     browserName: 'Android',
     platform: 'Linux',
     version: '4.1'
     },
     'SL_Android_4.2': {
     base: 'SauceLabs',
     browserName: 'Android',
     platform: 'Linux',
     version: '4.2'
     },
     'SL_Android_4.3': {
     base: 'SauceLabs',
     browserName: 'Android',
     platform: 'Linux',
     version: '4.3'
     },*/
    'SL_Android_4.4': {
      base: 'SauceLabs',
      browserName: 'Android',
      platform: 'Linux',
      version: '4.4'
    },
    'SL_IOS_7': {
      base: 'SauceLabs',
      browserName: 'iPhone',
      platform: 'OS X 10.9',
      version: '7.1'
    },
    'SL_Safari_5': {
      base: 'SauceLabs',
      browserName: 'Safari',
      platform: 'Windows 7',
      version: '5'
    },
    'SL_Safari_6': {
      base: 'SauceLabs',
      browserName: 'Safari',
      platform: 'OS X 10.8',
      version: '6'
    },
    'SL_Safari_7': {
      base: 'SauceLabs',
      browserName: 'Safari',
      platform: 'OS X 10.9',
      version: '7'
    },
    'SL_Safari_8': {
      base: 'SauceLabs',
      browserName: 'Safari',
      platform: 'OS X 10.10',
      version: '8'
    },
    'SL_Safari_9': {
      base: 'SauceLabs',
      browserName: 'Safari',
      platform: 'OS X 10.11',
      version: '9'
    },
    'SL_Opera': {
      base: 'SauceLabs',
      browserName: 'opera',
      platform: 'Windows 7'
    },
    'SL_Opera_Linux': {
      base: 'SauceLabs',
      browserName: 'opera',
      platform: 'Linux'
    }
  };
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: './',

    frameworks: ['browserify', 'jasmine'],

    files: [
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/lodash/dist/lodash.min.js',
      'bower_components/jasmine-jquery/lib/jasmine-jquery.js',
      'bower_components/jasmine-jsreporter/jasmine-jsreporter.js',

      'dist/vissense.js',

      'spec/**/*.js',

      // fixtures
      {pattern: 'spec/**/*.html', watched: true, served: true, included: false}
    ],

    reporters: ['dots', 'saucelabs'],

    preprocessors: {
      'spec/vissenseRequireSpec_.js': ['browserify']
    },

    browserify: {
      debug: true,
      transform: ['browserify-shim']
    },

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
