# Seguimiento: Preparación del despliegue en Render (frontend y backend)

Estado: especificación draft. Pendiente de aprobación y ejecución.

- [x] Redactar la especificación técnica (spec.md). (hecho: este archivo)
- [x] Redactar el plan de implementación (plan.md). (hecho: este archivo)
- [ ] Aprobar el plan con el usuario/equipo.
- [ ] Ajustar scripts `start` y `build` en `package.json` de front y back.
- [ ] Configurar variables de entorno `PORT`, `LOTES_CSV_PATH`, `ENTREGAS_CSV_PATH`, `NODE_ENV` para Render.
- [ ] Ejecutar `npm --prefix front run build` y verificar que `dist/front/` se genera.
- [ ] Ejecutar `npm --prefix back run build` y `npm --prefix back run start` en local con `PORT=10000` etc.
- [ ] Crear los servicios en Render (Backend Node + Static Site frontend).
- [ ] Introducir las variables de entorno en el dashboard de Render.
- [ ] Desplegar y verificar que ambas aplicaciones funcionan en las URLs provistas.
- [ ] Probar los CRUD completos (inventario + entregas) en el entorno de producción.
- [ ] Registrar las URLs de Render en la documentación del proyecto.
- [ ] Actualizar `README` o `INSTALL` con la nueva sección "Despliegue en Render".

## Verificación realizada

- (pendiente tras aprobación).