module.exports = function(config) {
  let configuration = {

    frameworks: ['jasmine', 'karma-typescript'],

    files: [
      {
        pattern: 'https://cdnjs.cloudflare.com/ajax/libs/jasmine-ajax/3.3.1/mock-ajax.min.js'
      },
      {
        pattern: 'src/*.scss'
      },
      {
        pattern: 'src/*.ts'
      }
    ],

    preprocessors: {
      'src/*.ts': ['karma-typescript'],
      'src/*.scss': ['scss'],
    },

    reporters: ['mocha', 'karma-typescript'],

    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    },

    browsers: ['Chrome']
  };

  if (process.env.TRAVIS){
    configuration.reporters.push('coverage', 'coveralls');
  }

  config.set(configuration);
};