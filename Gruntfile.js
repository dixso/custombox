'use strict';
module.exports = function(grunt) {
  require('time-grunt')(grunt);
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    header: '/*\n *  <%= pkg.name %> - <%= pkg.description %>\n' +
    ' *  version: <%= pkg.version %>\n' +
    ' *  http://dixso.github.io/custombox/\n' +
    ' *  (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> - @dixso9\n' +
    ' *\n',

    License: ' *  Under MIT License - http://opensource.org/licenses/MIT\n' + ' */\n',

    banner: '<%= header %>' + '<%= License %>',

    legacy: '<%= header %>' +
    ' *  babel-polyfill - https://www.npmjs.com/package/babel-polyfill\n' +
    ' *  babel-plugin-transform-object-assign - https://www.npmjs.com/package/babel-plugin-transform-object-assign\n' +
    ' *  es6-promise - https://www.npmjs.com/package/es6-promise\n' +
    ' *  custom-event-polyfill - https://www.npmjs.com/package/custom-event-polyfill\n' +
    ' *  fullscreen-api-polyfill - https://www.npmjs.com/package/fullscreen-api-polyfill\n' +
    ' *\n' +
    '<%= License %>',

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
          presets: ['es2015'],
          plugins: ['transform-object-assign']
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
      legacy: {
        options: {
          mangle: false
        },
        files: {
          'dist/custombox.legacy.min.js': ['dist/built/custombox.legacy.min.js']
        }
      }
    },
    concat: {
      dist: {
        options: {
          stripBanners: true
        },
        src: [
          './node_modules/babel-polyfill/dist/polyfill.min.js',
          './node_modules/custom-event-polyfill/custom-event-polyfill.js',
          './node_modules/es6-promise/dist/es6-promise.auto.min.js',
          './node_modules/fullscreen-api-polyfill/fullscreen-api-polyfill.min.js',
        ],
        dest: 'dist/built/custombox.legacy.min.js',
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
          src: ['dist/custombox.min.*']
        }
      },
      legacy: {
        options: {
          position: 'top',
          banner: '<%= legacy %>',
          linebreak: false,
        },
        files: {
          src: ['dist/custombox.legacy.*']
        }
      }
    },
    bump: {
      options: {
        files: ['package.json', 'bower.json', 'dist/custombox.*'],
        commitFiles: ['package.json', 'bower.json', 'dist/*'],
        tagName: '%VERSION%',
        prereleaseName: 'rc',
        pushTo: 'origin',
        push: true,
      }
    },
    fixpack: {
      dist: {
        src: ['package.json', 'bower.json'],
      },
    },
  });

  let target = grunt.option('target') ? `:${grunt.option('target')}` : '';
  grunt.registerTask('dist', ['clean:start', 'babel:dist', 'uglify:dist', 'autoprefixer:dist', 'cssmin:dist', 'concat:dist', 'uglify:legacy', 'usebanner', 'clean:end']);
  grunt.registerTask('release', ['dist', 'update:bower', 'fixpack:dist', `bump${target}`]);

  grunt.registerTask('update:bower', () => {
    const files = ['bower.json'];
    const pkg = grunt.file.readJSON('package.json');
    const replace = ['version', 'description', 'name', 'homepage', 'license', 'author', 'repository'];

    for (let e = 0, te = files.length; e < te; e ++) {
      let project = grunt.file.readJSON(files[e]);
      if (!grunt.file.exists(files[e])) {
        grunt.log.error(`file ${files[e]} not found`);
        return true;
      }

      for (let i = 0, t = replace.length; i < t; i++) {
        project[replace[i]] = pkg[replace[i]];
      }

      grunt.file.write(files[e], JSON.stringify(project, null, 2));
    }
  });
};
