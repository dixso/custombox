'use strict';
module.exports = function ( grunt ) {
    // Displays the execution time of grunt tasks.
    require('time-grunt')( grunt );

    // Globule to filter npm module dependencies by name.
    require('matchdep').filterDev('grunt-*').forEach( grunt.loadNpmTasks );

    grunt.initConfig( {

        // [OPTION] Package.
        pkg: grunt.file.readJSON( 'package.json' ),

        files: {
            js: [
                './src/js/*.js',
                './demo/js/*.js'
            ],
            css: [
                './src/css/*.css',
                './demo/css/*.css'
            ],
            html: [
                './index.html'
            ]
        },

        connect: {
            server: {
                options: {
                    hostname: 'localhost',
                    keepalive: true,
                    open: true
                }
            }
        },

        watch: {
            js: {
                files: [
                    '<%= files.js %>',
                    '<%= files.css %>',
                    '<%= files.html %>'
                ],
                options: {
                    livereload: true
                }
            }
        },

        autoprefixer: {
            default: {
                options: {
                    // Target-specific options go here.
                },
                src:    'src/css/*.css',
                dest:   'dist/css/custombox.css'
            }
        }

    });
};