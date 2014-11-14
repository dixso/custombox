'use strict';
module.exports = function ( grunt ) {
    require('time-grunt')( grunt );

    require('matchdep').filterDev('grunt-*').forEach( grunt.loadNpmTasks );

    grunt.initConfig( {
        pkg: grunt.file.readJSON('package.json'),

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
                './index.html',
                './demo/xhr/*.html'
            ],
            json: [
                'package.json'
            ]
        },

        banner: '/*\n *  <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                ' *  Modal Window Effects with transitions CSS3.\n' +
                ' *  http://dixso.github.io/custombox/\n' +
                ' *  (c) 2014 Julio de la Calle - @dixso9\n' +
                ' *\n' +
                ' *  Under MIT License - http://opensource.org/licenses/MIT\n' +
                ' */\n',

        connect: {
            default: {
                options: {
                    hostname:   'localhost',
                    port:       9001,
                    keepalive:  true,
                    open:       true
                }
            }
        },

        watch: {
            default: {
                files: [
                    '<%= files.js %>',
                    '<%= files.css %>',
                    '<%= files.html %>',
                    '<%= files.json %>'
                ],
                options: {
                    livereload: true
                },
                tasks: ['dev']
            }
        },

        clean: {
            default: {
                src: ['./dist']
            }
        },

        csslint: {
            default: {
                options: {
                    'adjoining-classes':    false,
                    'vendor-prefix':        false,
                    'universal-selector':   false
                },
                src: ['src/css/*.css']
            }
        },

        autoprefixer: {
            default: {
                options: {
                    browsers: ['last 2 versions', 'ie 8', 'ie 9', 'ios 7']
                },
                src:    'src/css/*.css',
                dest:   'dist/custombox.min.css'
            }
        },

        cssmin: {
            default: {
                options: {
                    banner: '<%= banner %>'
                },
                files: {
                    'dist/custombox.min.css': ['dist/custombox.min.css']
                }
            }
        },

        jshint: {
            options: {
                '-W054': true
            },
            default: ['src/js/*.js']
        },

        uglify: {
            default: {
                options: {
                    banner: '<%= banner %>'
                },
                files: {
                    'dist/custombox.min.js': ['src/js/*.js']
                }
            }
        }

    });

    /*
     ----------------------------
     Task init
     ----------------------------
     */
    grunt.registerTask('init', ['dev', 'connect']);

    /*
     ----------------------------
     Task dev
     ----------------------------
     */
    grunt.registerTask('dev', ['clean', 'autoprefixer', 'cssmin', 'uglify']);

    /*
     ----------------------------
     Task development
     ----------------------------
     */
    grunt.registerTask('default', ['clean', 'csslint', 'autoprefixer', 'cssmin', 'jshint', 'uglify', 'updatejson']);

    /*
     ----------------------------
     Task replace
     ----------------------------
     */
    grunt.registerTask('updatejson', function (key, value) {
        var files = ['bower.json', 'custombox.jquery.json'],
            pkg = grunt.file.readJSON('package.json'),
            replace = ['version', 'description', 'name', 'homepage'];

        for ( var e = 0, te = files.length; e < te; e ++ ) {
            var project = grunt.file.readJSON(files[e]);
            if ( !grunt.file.exists(files[e]) ) {
                grunt.log.error("file " + files[e] + " not found");
                return true;
            }

            for ( var i = 0, t = replace.length; i < t; i++ ) {
                project[replace[i]] = pkg[replace[i]];
            }

            grunt.file.write(files[e], JSON.stringify(project, null, 2));
        }
    });
};