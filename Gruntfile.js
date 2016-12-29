'use strict';
module.exports = function(grunt) {
  require('time-grunt')(grunt);
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    banner: '/*\n *  <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
    ' *  <%= pkg.description %>\n' +
    ' *  http://dixso.github.io/custombox/\n' +
    ' *  (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> - @dixso9\n' +
    ' *\n' +
    ' *  Under MIT License - http://opensource.org/licenses/MIT\n' +
    ' */\n',

    browserSync: {
      bsFiles: {
        src : [
          'src/*.js',
          'src/*.css',
          'src/*.html',
        ]
      },
      options: {
        server: {
          baseDir: './src'
        }
      }
    },
    babel: {
      dist: {
        options: {
          presets: ['es2015']
        },
        files: {
          'dist/built/custombox.js': 'src/custombox.js'
        }
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/custombox.min.js': ['dist/built/custombox.js']
        }
      },
      polyfill: {
        options: {
          mangle: false,
          preserveComments: 'all',
        },
        files: {
          'dist/built/custom-event-polyfill.min.js': ['./node_modules/custom-event-polyfill/custom-event-polyfill.js']
        }
      }
    },
    concat: {
      dist: {
        options: {
          sourceMap: true,
        },
        src: ['dist/custombox.min.js', './node_modules/babel-polyfill/dist/polyfill.min.js', 'dist/built/custom-event-polyfill.min.js'],
        dest: 'dist/custombox.min.js',
      },
    },
    clean: {
      start: {
        src: ['dist/']
      },
      end: {
        src: ['dist/built']
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 8', 'ie 9']
      },
      dist: {
        src: ['src/*.css'],
        dest: 'dist/built/custombox.css',
      }
    },
    cssmin: {
      dist: {
        options: {
          sourceMap: true
        },
        files: {
          'dist/custombox.min.css': ['dist/built/custombox.css']
        }
      }
    },
    usebanner: {
      dist: {
        options: {
          position: 'top',
          banner: '<%= banner %>',
          linebreak: false,
        },
        files: {
          src: ['dist/*']
        }
      }
    },
    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: [],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'upstream',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false,
        prereleaseName: false,
        metadata: '',
        regExp: false
      }
    },
    fixpack: {
      dist: {
        src: 'package.json',
      },
    },
  });

  grunt.registerTask('dist', ['clean:start', 'babel:dist', 'uglify:dist', 'autoprefixer:dist', 'cssmin:dist', 'usebanner:dist', 'uglify:polyfill', 'concat:dist', 'clean:end']);
};
