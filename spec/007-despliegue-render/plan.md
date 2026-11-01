# Plan: Preparación del despliegue en Render (frontend y backend)

Estado: especificación draft. Redacción inicial para retroalimentación del usuario.

## Alcance y dependencias

- Depende de la especificación 006 (CRUD visual de entregasfrontend), aceptada el 2026-10-31.
- Depende de la identidad de marca "A la par" (especificación 004), aprobada el 2026-10-31.
- Backend 005 (spec/005-registro-entregas-familias-backend) ya verificado y operativo.
- Frontend Angular 22 compilado a archivos estáticos.

## Implementación prevista

1. **Revisar y ajustar scripts de npm** en `front/package.json` y `back/package.json` para modo producción.
   - `back`: `start` debe ejecutar `node dist/main.js` (o el starter de Render).
   - `front`: `build` ya existe (`ng build`), pero hay que verificar que la salida sea `dist/front`.
2. **Configurar variables de entorno** para Render:
   - `PORT`: puerto que Render asigna (process.env.PORT o 3000 por defecto).
   - `LOTES_CSV_PATH`: ruta relativa o absolute al CSV de lotes (Render persiste el directorio `back/data/`).
   - `ENTREGAS_CSV_PATH`: ruta relativa o absolute al CSV de entregas.
   - `NODE_ENV`: `production`.
3. **Crear/verificar archivo de inicio de Render**:
   - Render puede detectar `package.json` scripts `start` y `build` automáticamente.
   - Opcional: añadir `Dockerfile` si se requiere control fino (por ahora, usar scripts de npm).
4. **Probar build de producción**:
   - `npm --prefix front run build` → debe generar `dist/front/` con los archivos estáticos.
   - `npm --prefix back run build` → debe compilar TypeScript a `dist/main.js`.
   - `npm --prefix back run start` → debe levantar el servidor escuchando el `PORT` indicado.
5. **Desplegar en Render**:
   - Crear nuevo Service → Node para el backend.
   - Crear nuevo Static Site para el frontend, con el repo GitHub y la rama principal.
   - Configurar las variables de entorno en el dashboard de Render.
6. **Verificar despliegue**:
   - Acceder a la URL del frontend y confirmar que tanto el listado de inventario como el CRUD de entregas funcionan.
   - Probar que las CSV se leen correctamente (los archivos en `back/data/` deben persistir o subirse al repo).
7. **Actualizar documentación** `README` o `INSTALL` con los pasos seguidos y URLs de Render.

## Criterio de aceptación

- `npm --prefix front run build` genera `dist/front/` sin errores.
- `npm --prefix back run build` compila sin errores y `npm --prefix back run start` levanta el servidor.
- El servidor backend escucha el puerto que Render asigna (variable `PORT`).
- Las CSV se leen del path indicado por las env vars (o de `back/data/` por defecto).
- El frontend se sirve y las rutas `/inventario` y `/entregas` funcionan correctamente.
- La identidad "A la par" se mantiene visible en la navegación y la cabecera.

## Verificación realizada

- (pendiente de ejecutar tras aprobación del usuario).