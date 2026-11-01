# Especificación: Preparación del despliegue en Render (frontend y backend)

## Objetivo

Preparar el proyecto para su instalación y ejecución en la nube [Render](https://render.com/), que ofrece hosting gratuito para:
- Aplicaciones Node.js (backend) con contenedores Docker o scripts de inicio.
- Sitios estáticos con funciones server-side (frontend Angular).

El despliegue debe mantener la separación backend/front actual, el contrato CSV y la identidad de marca "A la par".

## Alcance

- **Backend (Render Node service):** Puerto configurable, CSV paths via env, `npm run start` prod.
- **Frontend (Render static site):** Build de producción `ng build`, salida en `dist/front`, servidor sirviendo archivos estáticos.
- **Comunicación:** Proxy inverso o puertos separados (backend 3000, frontend 4200/8080).
- **Variables de entorno:** `PORT`, `LOTES_CSV_PATH`, `ENTREGAS_CSV_PATH`, `NODE_ENV`.
- **No incluir:** módulos de desarrollo, scripts de test, seeds no versionadas.

## Tareas implícitas

1. Ajustar `package.json` scripts para modo producción (`start` vs `dev`).
2. Añadir `Render` como destino de despliegue en la documentación.
3. Verificar que el build de producción pasa lint, format y tests.
4. Documentar los pasos manuales o automatizados para conectar el repo de GitHub con Render.

## Restricciones

- Mantener compatibilidad con el modo actual `npm --prefix back run dev` y `npm --prefix front run start`.
- No modificar el contrato CSV ni la estructura de datos.
- Respetar identidad de marca "A la par" en el frontend renderizado.