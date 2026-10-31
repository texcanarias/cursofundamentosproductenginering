module.exports = {
  default: {
    paths: ['../spec/**/*.feature'],
    require: ['e2e/steps/**/*.cjs'],
    format: ['progress'],
  },
};
