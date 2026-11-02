# Seguimiento: Caducidad y localización de productos en el frontend

Estado: especificación aceptada por el usuario el 2026-10-31. Implementación y verificación completadas el 2026-10-31.

- [x] Redactar la especificación Gherkin del CRUD visual.
- [x] Redactar el plan y explicitar la dependencia del backend 002.
- [x] Revisar y aprobar flujos, campos, estados y criterios de accesibilidad.
- [x] Implementar modelo y servicio de persistencia en el navegador.
- [x] Implementar inventario, detalle, formularios y confirmación de eliminación.
- [x] Implementar estados de carga, validación y recuperación de errores.
- [x] Añadir pruebas unitarias de formularios, fechas, almacenamiento y estados de componentes.
- [x] Ejecutar pruebas unitarias, de integración y escenarios Gherkin automatizados tras activar Node 24.19.0.
- [x] Verificar accesibilidad, vista móvil, lint, formato y compilación tras activar Node 24.19.0.

## Actualización: persistencia en el navegador (2026-11-02)

La persistencia HTTP descrita originalmente en esta especificación fue sustituida por el
almacenamiento local del navegador definido en la especificación 009. Los flujos, campos, estados y
criterios de accesibilidad de `productos.feature` se mantienen; solo cambia el origen de los datos.

## Verificación realizada (Node 24.19.0, 2026-11-02)

- `npm test`: 85 pruebas correctas en 13 archivos.
- `npm run lint`: correcto.
- `npm run format:check`: correcto.
- `npm run build`: correcto.
- `npm run test:gherkin`: 41 escenarios y 367 pasos correctos, incluidos los 17 escenarios de
  `productos.feature` adaptados a `localStorage`.

La implementación cubre los escenarios de `productos.feature` mediante el repositorio de
almacenamiento del navegador, la vista de inventario, el detalle, los formularios de alta y edición,
el diálogo de confirmación de eliminación y los estados de validación y error.

