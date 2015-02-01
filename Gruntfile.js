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
                ' *  (c) 2015 Julio de la Calle - @dixso9\n' +
                ' *\n' +
                ' *  Under MIT License - http://opensource.org/licenses/MIT\n' +
                ' */\n',

        legacy: '/*\n *  <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                ' *  Modal Window Effects with transitions CSS3.\n' +
                ' *  http://dixso.github.io/custombox/\n' +
                ' *  (c) 2015 Julio de la Calle - @dixso9\n' +
                ' *\n' +
                ' *  dataset - https://gist.github.com/brettz9/4093766\n' +
                ' *  classList - http://purl.eligrey.com/github/classList.js/blob/master/classList.js\n' +
                ' *  addEventListener - https://gist.github.com/2864711/946225eb3822c203e8d6218095d888aac5e1748e\n' +
                ' *  :scope polyfill - http://stackoverflow.com/questions/6481612/queryselector-search-immediate-children\n' +
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
            },
            karma: {
                files: ['test/spec/*.js'],
                tasks: ['karma:default']
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
                    'universal-selector':   false,
                    'fallback-colors':      false
                },
                src: ['src/css/*.css']
            }
        },

        autoprefixer: {
            default: {
                options: {
                    browsers: ['last 8 versions']
                },
                src:    'src/css/*.css',
                dest:   'dist/custombox.min.css'
            }
        },

        cssmin: {
            default: {
                files: {
                    'dist/custombox.min.css': ['dist/custombox.min.css']
                }
            }
        },

        jshint: {
            options: {
                '-W054': true
            },
            default: ['src/js/custombox.js']
        },

        uglify: {
            default: {
                files: {
                    'dist/custombox.min.js': ['src/js/custombox.js']
                }
            },
            legacy: {
                files: {
                    'dist/legacy.min.js': ['src/js/legacy.js']
                }
            }
        },

        karma: {
            default: {
                configFile: 'karma.conf.js',
                runnerPort: 9999,
                autoWatch:  true,
                browsers:   ['Chrome', 'Firefox']
            }
        },

        replace: {
            start: {
                options: {
                    patterns: [
                        {
                            match: /\/\/,test: _private/g,
                            replacement: ',test: _private'
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/js/*.js'],
                        dest: 'src/js/'
                    }
                ]
            },
            end: {
                options: {
                    patterns: [
                        {
                            match: /,test: _private/g,
                            replacement: '//,test: _private'
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/js/*.js'],
                        dest: 'src/js/'
                    }
                ]
            }
        },

        injector: {
            options: {
                addRootSlash:   false,
                template:       'index.html'
            },
            dev: {
                files: {
                    'index.html': [
                        'src/js/legacy.js',
                        'src/js/custombox.js',
                        'src/css/*.css'
                    ]
                }
            },
            prod: {
                files: {
                    'index.html': [
                        'dist/*.js',
                        'dist/*.css'
                    ]
                }
            }
        },

        usebanner: {
            custombox: {
                options: {
                    position:   'top',
                    banner:     '<%= banner %>',
                    linebreak:  true
                },
                files: {
                    src: [
                        'dist/custombox.min.js',
                        'dist/*.css'
                    ]
                }
            },
            legacy: {
                options: {
                    position:   'top',
                    banner:     '<%= legacy %>',
                    linebreak:  true
                },
                files: {
                    src: [
                        'dist/legacy.min.js'
                    ]
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
    grunt.registerTask('dev', ['clean', 'autoprefixer', 'cssmin', 'uglify', 'injector:dev']);

    /*
     ----------------------------
     Task test
     ----------------------------
     */
    grunt.registerTask('test', ['replace:start', 'karma', 'replace:end']);

    /*
     ----------------------------
     Task development
     ----------------------------
     */
    grunt.registerTask('default', ['test', 'clean', 'csslint', 'autoprefixer', 'cssmin', 'jshint', 'uglify', 'updatejson', 'injector:prod']);

    /*
     ----------------------------
     Task replace
     ----------------------------
     */
    grunt.registerTask('updatejson', function ( key, value ) {
        var files = ['bower.json'],
            pkg = grunt.file.readJSON('package.json'),
            replace = ['version', 'description', 'name', 'homepage'];

        for ( var e = 0, te = files.length; e < te; e ++ ) {
            var project = grunt.file.readJSON(files[e]);
            if ( !grunt.file.exists(files[e]) ) {
                grunt.log.error('file ' + files[e] + ' not found');
                return true;
            }

            for ( var i = 0, t = replace.length; i < t; i++ ) {
                project[replace[i]] = pkg[replace[i]];
            }

            grunt.file.write(files[e], JSON.stringify(project, null, 2));

            grunt.task.run(['usebanner']);
        }
    });
};