module.exports = function(config) {
  let configuration = {

    frameworks: ['jasmine', 'karma-typescript'],

    files: [
      {
        pattern: 'src/*.ts'
      }
    ],

    preprocessors: {
      '**/*.ts': ['karma-typescript']
    },

    reporters: ['dots', 'karma-typescript'],

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