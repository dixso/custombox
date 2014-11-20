module.exports = function( config ) {
    config.set({
        basePath : './',

        frameworks: ['jasmine'],

        files : [
            'test/vendor/jquery-2.1.1.min.js',
            'test/vendor/jasmine-jquery.js',
            'dist/*.js',
            'test/spec/*.js'
        ],

        captureTimeout: 10000,

        singleRun: true,

        logLevel: config.LOG_INFO,

        plugins: [
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-firefox-launcher'
        ]
    });
};