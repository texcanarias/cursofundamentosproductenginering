# Seguimiento: Preparación del despliegue en Vercel (frontend y backend)

Estado: especificación draft. Pendiente de aprobación y ejecución.

- [x] Redactar la especificación técnica (spec.md). (hecho: este archivo)
- [x] Redactar el plan de implementación (plan.md). (hecho: este archivo)
- [ ] Aprobar el plan con el usuario/equipo.
- [x] Crear archivo `vercel.json` en la raíz del repositorio.
- [x] Adaptar el backend para ejecutarse como función serverless de Vercel (`api/index.ts`).
- [x] Ajustar scripts `start` y `build` en `package.json` de front y back. (ya ajustados en spec 007)
- [x] Configurar variables de entorno en `vercel.json` (`LOTES_CSV_PATH`, `ENTREGAS_CSV_PATH`, `NODE_ENV`).
- [x] Ejecutar `npm --prefix front run build` y verificar que `dist/front/browser/` se genera. (comprobado)
- [x] Ejecutar `npm --prefix back run build` y verificar que compila sin errores. (comprobado)
- [x] Crear `package.json` en la raíz del proyecto para que Vercel ejecute desde la raíz (evita auto-detección de Angular en `front/`).
- [x] Eliminar sección `functions` del `vercel.json` (Vercel auto-detecta el runtime).
- [x] Añadir `"framework": null` al `vercel.json` para desactivar auto-detección de framework.
- [ ] Conectar el repositorio de GitHub con Vercel.
- [ ] Desplegar y verificar que ambas aplicaciones funcionan en las URLs provistas.
- [ ] Probar los CRUD completos (inventario + entregas) en el entorno de producción.
- [ ] Registrar las URLs de Vercel en la documentación del proyecto.
- [x] Actualizar `README` con la nueva sección "Despliegue en Vercel".

## Verificación realizada

- (pendiente tras aprobación).