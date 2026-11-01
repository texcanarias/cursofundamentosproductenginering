const { createApp } = require('./_backend/infrastructure/http/create-app.js');

module.exports = (req, res) => {
  const app = createApp();
  return app(req, res);
};