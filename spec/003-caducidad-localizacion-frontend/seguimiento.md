# Seguimiento: Caducidad y localización de productos en el frontend

Estado: especificación aceptada por el usuario el 2026-10-31. Implementación y verificación completadas el 2026-10-31.

- [x] Redactar la especificación Gherkin del CRUD visual.
- [x] Redactar el plan y explicitar la dependencia del backend 002.
- [x] Revisar y aprobar flujos, campos, estados y criterios de accesibilidad.
- [x] Implementar modelo y servicio HTTP.
- [x] Implementar inventario, detalle, formularios y confirmación de eliminación.
- [x] Implementar estados de carga, validación y recuperación de errores.
- [x] Añadir pruebas unitarias de formularios, fechas, servicio HTTP y estados de componentes.
- [x] Ejecutar pruebas unitarias, de integración y escenarios Gherkin automatizados tras activar Node 24.19.0.
- [x] Verificar accesibilidad, vista móvil, lint, formato y compilación tras activar Node 24.19.0.

## Verificación realizada (Node 24.19.0)

- `npm --prefix front test`: 38 pruebas correctas en 6 archivos.
- `npm --prefix front run lint`: correcto.
- `npm --prefix front run format:check`: correcto.
- `npm --prefix front run build`: correcto.
- `npm --prefix front run test:gherkin`: 25 escenarios y 214 pasos correctos (incluyendo los 17 escenarios de `productos.feature`).

La implementación del frontend cubre los 17 escenarios Gherkin de `productos.feature` mediante el servicio HTTP, la vista de inventario, el detalle, los formularios de alta y edición, el diálogo de confirmación de eliminación y los estados de carga, validación y error.
