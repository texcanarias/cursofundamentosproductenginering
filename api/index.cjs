const { createApp } = require('../back/dist-vercel/src/infrastructure/http/create-app.js');

module.exports = (req, res) => {
  const app = createApp();
  return app(req, res);
};