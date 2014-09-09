module.exports = function(config) {
    'use strict';

    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: './',
 
        frameworks: ['jasmine'],
 
        files: [
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/lodash/dist/lodash.min.js',
            'bower_components/jasmine-jquery/lib/jasmine-jquery.js',

            'dist/vissense.js',

            'spec/**/*.js',
            // fixtures
            {pattern: 'spec/**/*.html', watched: true, served: true, included: false}
        ],

        exclude: [
        ],
 
        reporters: ['progress', 'coverage'],
 
        port: 3000,
 
        colors: true,
 
        logLevel: config.LOG_INFO,
 
        autoWatch: true,
 
        browsers: ['PhantomJS', 'Firefox'],
        //browsers: ['PhantomJS', 'Chrome', 'Firefox', 'Opera'],

        customLaunchers: {
          Chrome_without_security: {
            base: 'Chrome',
            flags: ['--disable-web-security']
          }
        },

        preprocessors: {
          'tmp/vissense.js': ['coverage']
        },

        coverageReporter: {
            reporters:[
              {type: 'lcov', dir:'dist/coverage/'}
            ]
        },

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,
 
        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true
    });
};