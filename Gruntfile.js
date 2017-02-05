'use strict';
module.exports = function(grunt) {
  require('time-grunt')(grunt);
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    banner: '/*\n *  <%= pkg.name %> - <%= pkg.description %>\n' +
    ' *  version: <%= pkg.version %>\n' +
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
        files: ['package.json', 'bower.json', 'dist/*'],
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
  grunt.registerTask('release', ['clean:start', 'babel:dist', 'uglify:dist', 'autoprefixer:dist', 'cssmin:dist', 'usebanner:dist', 'uglify:polyfill', 'concat:dist', 'clean:end', 'update:bower', 'fixpack:dist', `bump${target}`]);

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
