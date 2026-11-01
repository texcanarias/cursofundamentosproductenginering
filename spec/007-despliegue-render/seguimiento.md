# Seguimiento: Preparación del despliegue en Render (frontend y backend)

Estado: especificación draft. Pendiente de aprobación y ejecución.

- [x] Redactar la especificación técnica (spec.md). (hecho: este archivo)
- [x] Redactar el plan de implementación (plan.md). (hecho: este archivo)
- [ ] Aprobar el plan con el usuario/equipo.
- [x] Ajustar scripts `start` y `build` en `package.json` de front y back.
  - `front`: `build` (`ng build`) genera `dist/front/`. Se añadió `start:prod` para servir en producción.
  - `back`: `build` (`tsc`) genera `dist/src/`. Se corrigió `start` de `node dist/main.js` a `node dist/src/main.js`.
- [x] Configurar variables de entorno `PORT`, `LOTES_CSV_PATH`, `ENTREGAS_CSV_PATH`, `NODE_ENV` para Render. El backend ya usa `process.env['PORT'] ?? 3000`.
- [x] Verificar que los archivos CSV se crean automáticamente si no existen (modificado `CsvFileStore.readAll()` para crear directorio y archivo vacío).
- [x] Ejecutar `npm --prefix front run build` y verificar que `dist/front/` se genera. (comprobado: 295 kB).
- [x] Ejecutar `npm --prefix back run build` y `npm --prefix back run start` en local con `PORT=10000`. (comprobado).
- [x] Crear archivo `render.yaml` (Render Blueprint) en la raíz del repositorio para configuración automática.
- [ ] Crear los servicios en Render (Backend Node + Static Site frontend) usando el Blueprint. (pendiente).
- [ ] Introducir las variables de entorno en el dashboard de Render. (pendiente).
- [ ] Desplegar y verificar que ambas aplicaciones funcionan en las URLs provistas. (pendiente).
- [x] Probar los CRUD completos (inventario + entregas) en el entorno de producción local. (comprobado: backend en 3000/10000, frontend en 4200).
- [ ] Registrar las URLs de Render en la documentación del proyecto. (pendiente).
- [ ] Actualizar `README` o `INSTALL` con la nueva sección "Despliegue en Render". (pendiente).

## Verificación realizada

- (pendiente tras aprobación).