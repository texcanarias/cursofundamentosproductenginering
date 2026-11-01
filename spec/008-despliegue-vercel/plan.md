# Plan: Preparación del despliegue en Vercel (frontend y backend)

Estado: especificación draft. Redacción inicial para retroalimentación del usuario.

## Alcance y dependencias

- Depende de la especificación 006 (CRUD visual de entregas frontend), aceptada el 2026-10-31.
- Depende de la identidad de marca "A la par" (especificación 004), aprobada el 2026-10-31.
- Backend 005 (spec/005-registro-entregas-familias-backend) ya verificado y operativo.
- Frontend Angular 22 compilado a archivos estáticos.

## Implementación prevista

1. **Revisar y ajustar scripts de npm** en `front/package.json` y `back/package.json` para modo producción.
   - `back`: `start` debe ejecutar `node dist/src/main.js` (o el handler de Vercel).
   - `front`: `build` ya existe (`ng build`), pero hay que verificar que la salida sea `dist/front/browser`.
2. **Crear archivo `vercel.json`** en la raíz del repositorio con:
   - `buildCommand`: `npm --prefix front run build`
   - `outputDirectory`: `front/dist/front/browser`
   - `rewrites`: redirigir `/api/*` al backend serverless.
   - `functions`: configurar el backend como función serverless.
3. **Adaptar el backend para Vercel**:
   - Crear un handler serverless que exporte `app` (Express) como función.
   - Vercel espera una función que reciba `(req, res)` y la exporte como default.
   - El archivo `api/index.ts` o `api/index.js` es el punto de entrada para Vercel.
   - El backend debe funcionar tanto en modo standalone (Express) como en modo serverless (Vercel).
4. **Configurar variables de entorno** en Vercel:
   - `LOTES_CSV_PATH`: ruta al CSV de lotes.
   - `ENTREGAS_CSV_PATH`: ruta al CSV de entregas.
   - `NODE_ENV`: `production`.
   - (Vercel no usa `PORT`; asigna automáticamente).
5. **Probar build de producción**:
   - `npm --prefix front run build` → debe generar `dist/front/browser/` con los archivos estáticos.
   - `npm --prefix back run build` → debe compilar TypeScript a `dist/src/`.
6. **Desplegar en Vercel**:
   - Conectar el repositorio de GitHub con Vercel.
   - Vercel detecta automáticamente `vercel.json` y configura el despliegue.
7. **Verificar despliegue**:
   - Acceder a la URL del frontend y confirmar que tanto el listado de inventario como el CRUD de entregas funcionan.
   - Probar que las CSV se leen correctamente.

## Criterio de aceptación

- `npm --prefix front run build` genera `dist/front/browser/` sin errores.
- `npm --prefix back run build` compila sin errores.
- El backend funciona como función serverless en Vercel.
- El frontend se sirve desde `dist/front/browser/` y las rutas `/inventario` y `/entregas` funcionan correctamente.
- La identidad "A la par" se mantiene visible en la navegación y la cabecera.
- Las variables de entorno se configuran en el dashboard de Vercel.

## Verificación realizada

- (pendiente de ejecutar tras aprobación del usuario).