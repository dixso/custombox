'use strict';
module.exports = function(grunt) {
  require('time-grunt')(grunt);
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    browserSync: {
      bsFiles: {
        src : [
          'src/**',
          './index.html',
        ]
      },
      options: {
        server: {
          baseDir: './'
        }
      }
    }
  });

  grunt.registerTask('default', ['browserSync']);
};