# Seguimiento: Registro de entregas de ayuda alimentaria a familias (backend)

Estado: especificación aprobada por el usuario el 2026-10-31. Implementación y verificación completadas el 2026-11-01.

- [x] Redactar la especificación Gherkin y el contrato HTTP propuesto. (hecho: entregas.feature, spec.md)
- [x] Redactar el plan de implementación. (hecho: plan.md)
- [x] Revisar y aprobar el modelo de entrega, los campos y el contrato HTTP. (aprobado por el usuario el 2026-10-31)
- [x] Implementar dominio, casos de uso y repositorio CSV en el backend.
- [x] Implementar los endpoints CRUD y sus errores en el backend.
- [x] Añadir pruebas unitarias y de integración en el backend.
- [x] Verificar escenarios Gherkin, lint, formato y compilación del backend.

## Cobertura de aceptación

Los escenarios de `entregas.feature` se verifican mediante pruebas Vitest y Supertest, sin añadir un ejecutor Cucumber al backend.

| Escenarios Gherkin                                                        | Pruebas automatizadas                                                                |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Registrar una entrega y registrar una entrega con observación opcional    | `back/test/integration/deliveries.test.ts`                                           |
| Consultar todas las entregas y consultar una entrega por identificador    | `back/test/integration/deliveries.test.ts`                                           |
| Eliminar una entrega                                                      | `back/test/integration/deliveries.test.ts`                                           |
| Rechazar entrega sin identificador de familia, sin fecha o con fecha inválida | `back/test/integration/delivery-validation.test.ts` y `back/test/unit/delivery.test.ts` |
| Registrar entrega con fecha pasada                                        | `back/test/integration/deliveries.test.ts` y `back/test/unit/delivery.test.ts`        |
| Operar sobre una entrega inexistente                                      | `back/test/integration/deliveries.test.ts` y `back/test/integration/delivery-validation.test.ts` |
| Mantener entregas tras reiniciar el servidor                              | `back/test/integration/deliveries.test.ts`                                           |
| Conservar caracteres especiales en identificador de familia               | `back/test/integration/deliveries.test.ts`                                           |

Se incluyen pruebas adicionales de concurrencia en una instancia, recuperación tras escrituras fallidas, cuerpos JSON inválidos, comas, comillas y saltos de línea en la observación, y eliminación de la última entrega.

## Verificación realizada

- Node 24.19.0, activado mediante la configuración `.nvmrc` del repositorio.
- `npm --prefix back test`: 200 pruebas correctas en 11 archivos.
- `npm --prefix back run lint`: correcto.
- `npm --prefix back run format:check`: correcto.
- `npm --prefix back run build`: correcto.
- `git diff --check`: correcto.

La implementación se limita al backend. La especificación 006 (frontend) sigue pendiente y no se han realizado commits.
