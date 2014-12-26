module.exports = function( config ) {
    config.set({
        basePath : './',

        frameworks: ['jasmine'],

        files : [
            'https://code.jquery.com/jquery-2.1.3.min.js',
            'https://cdn.rawgit.com/velesin/jasmine-jquery/master/lib/jasmine-jquery.js',
            'src/js/*.js',
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