module.exports = async (req, res) => {
  const { createApp } = await import('../back/dist/src/infrastructure/http/create-app.js');
  const app = createApp();
  return app(req, res);
};
