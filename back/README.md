# Backend

Backend Node.js/TypeScript con límites DDD y persistencia CSV detrás de un puerto.

```bash
npm ci
npm run dev
npm test
npm run build
npm run lint
```

La API expone `GET /api/health`. Los datos CSV locales se guardan bajo `back/data/` y no deben contener información real en pruebas.