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

            'bower_components/brwsrfy-metrics/dist/brwsrfy-metrics.js',
            'bower_components/countonmejs/dist/countonmejs.min.js',
            'bower_components/happeningsjs/dist/happeningsjs.min.js',
            'bower_components/againjs/dist/againjs.min.js',

            'bower_components/visibilityjs/lib/visibility.core.js',

            'src/main/vissense.polyfill.js',
            'src/main/utils/vissense.utils.js',
            'src/main/utils/vissense.utils._.js',
            'src/main/utils/vissense.utils.pagevisibility.js',
            'src/main/utils/vissense.utils.elementstyling.js',
            'src/main/utils/vissense.utils.elementposition.js',
            'src/main/utils/vissense.utils.elementvisibility.js',
            'src/main/utils/vissense.utils.support.js',

            'src/main/core/vissense.core.js',

            'src/main/monitor/vissense.monitor.state.js',
            'src/main/monitor/vissense.monitor.js',

            'src/main/timer/vissense.timer.js',

            'src/main/metrics/vissense.metrics.js',

            'src/main/plugins/percentage_time_test/vissense.plugins.percentage_time_test.js',
            'src/main/plugins/percentage_time_test/vissense.plugins.50_1_test.js',

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

        preprocessors: {
          'src/main/**/*.js': ['coverage']
        },
 
        browsers: ['PhantomJS', 'Chrome', 'Firefox', 'Opera'],
        //browsers: ['PhantomJS'],

        customLaunchers: {
          Chrome_without_security: {
            base: 'Chrome',
            flags: ['--disable-web-security']
          }
        },

        coverageReporter: {
            reporters:[
              {type: 'lcov', dir:'bin/coverage/'}
            ]
        },

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,
 
        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true
    });
};