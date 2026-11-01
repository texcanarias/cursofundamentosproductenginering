# Especificación: Preparación del despliegue en Vercel (frontend y backend)

## Objetivo

Preparar el proyecto para su instalación y ejecución en [Vercel](https://vercel.com/), que ofrece hosting gratuito para:
- Aplicaciones serverless Node.js (backend) mediante funciones serverless.
- Sitios estáticos con CDN global (frontend Angular).

Vercel detecta automáticamente proyectos Node.js y Angular, y permite configurar variables de entorno, builds y rutas mediante un archivo `vercel.json`.

## Alcance

- **Backend (Vercel Serverless Function):** Adaptar el backend Express para ejecutarse como función serverless de Vercel. Puerto no configurable (Vercel asigna el puerto automáticamente). CSV paths via env, `npm run start` prod.
- **Frontend (Vercel Static Site):** Build de producción `ng build`, salida en `dist/front/browser`, servido por CDN global.
- **Comunicación:** Rewrite rules en `vercel.json` para redirigir `/api/*` al backend serverless.
- **Variables de entorno:** `LOTES_CSV_PATH`, `ENTREGAS_CSV_PATH`, `NODE_ENV`.
- **No incluir:** módulos de desarrollo, scripts de test, seeds no versionadas.

## Tareas implícitas

1. Ajustar `package.json` scripts para modo producción (`start` vs `dev`).
2. Crear archivo `vercel.json` en la raíz con la configuración de build, output y rewrites.
3. Adaptar el backend para ejecutarse como función serverless de Vercel (exportar `app` como handler).
4. Verificar que el build de producción pasa lint, format y tests.
5. Documentar los pasos manuales o automatizados para conectar el repo de GitHub con Vercel.

## Restricciones

- Mantener compatibilidad con el modo actual `npm --prefix back run dev` y `npm --prefix front run start`.
- No modificar el contrato CSV ni la estructura de datos.
- Respetar identidad de marca "A la par" en el frontend renderizado.
- El backend debe funcionar tanto en modo standalone (Express) como en modo serverless (Vercel).