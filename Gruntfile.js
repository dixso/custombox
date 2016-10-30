'use strict';
module.exports = function(grunt) {
  require('time-grunt')(grunt);
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
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
  });
};
