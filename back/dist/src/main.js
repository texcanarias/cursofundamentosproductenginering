import { createApp } from './infrastructure/http/create-app.js';
const port = Number(process.env['PORT'] ?? 3000);
const app = createApp();
app.listen(port, () => {
    console.log(`Backend escuchando en http://localhost:${port}`);
});
