var webpackConf = require('./webpack.config.js');
module.exports = function (config) {
    config.set({
        files: [
            // Each file acts as entry point for the webpack configuration
            './node_modules/phantomjs-polyfill/bind-polyfill.js',
            'test/client/fixtures_helper.js',
            'test/client/**/*.js',
            // fixtures
            'test/client/fixtures/**/*.html'
        ],
        reporters: ['progress'],
        frameworks: ['mocha', 'sinon-chai', 'fixture'],
        preprocessors: {
            'test/client/**/*.js': ['webpack'],
            'test/client/fixtures/**/*.html': ['html2js']
        },
        //logLevel: config.LOG_DEBUG,
        webpack: {
            module: webpackConf.module
        },
        webpackMiddleware: {
            noInfo: true
        },
        browsers: ['PhantomJS'],
        plugins: [
            require('karma-fixture'),
            require('karma-html2js-preprocessor'),
            require('karma-webpack'),
            require('karma-mocha'),
            require('karma-sinon-chai'),
            require('karma-phantomjs-launcher'),
            require('karma-spec-reporter')
        ],
    });
};
