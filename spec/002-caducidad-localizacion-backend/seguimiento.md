# Seguimiento: Caducidad y localización de productos en el backend

Estado: especificación aceptada por el usuario el 2026-10-31. Implementación y verificación completadas el 2026-10-31.

- [x] Redactar la especificación Gherkin y el contrato HTTP propuesto.
- [x] Redactar el plan de implementación.
- [x] Revisar y aprobar el modelo de partida, los campos y el contrato HTTP.
- [x] Implementar dominio, casos de uso y repositorio CSV.
- [x] Implementar los endpoints CRUD y sus errores.
- [x] Añadir pruebas unitarias y de integración.
- [x] Verificar escenarios Gherkin, lint, formato y compilación.

## Cobertura de aceptación

Los escenarios de `productos.feature` se verifican mediante pruebas Vitest y Supertest, sin añadir un ejecutor Cucumber al backend.

| Escenarios Gherkin                                               | Pruebas automatizadas                                                                 |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Crear y consultar partidas; inventario vacío                     | `back/test/integration/lots.test.ts`                                                  |
| Varias caducidades, ubicaciones y partidas coincidentes          | `back/test/integration/lots.test.ts`                                                  |
| Modificar o eliminar sin alterar otras partidas                  | `back/test/integration/lots.test.ts`                                                  |
| Rechazar datos no válidos sin modificar el CSV                   | `back/test/integration/lot-validation.test.ts`                                        |
| Conservar productos caducados                                    | `back/test/unit/lot.test.ts` y `back/test/integration/lots.test.ts`                   |
| Operar sobre identificadores inexistentes                        | `back/test/integration/lots.test.ts`                                                  |
| Recuperar datos tras reiniciar y conservar caracteres especiales | `back/test/integration/lots.test.ts`                                                  |
| Fallos de persistencia sin confirmación de éxito                 | `back/test/integration/lots.test.ts` y `back/test/integration/lot-validation.test.ts` |

Se incluyen pruebas adicionales de concurrencia en una instancia, recuperación tras escrituras fallidas, cuerpos JSON inválidos y eliminación de la última partida.

## Verificación realizada

- Node 24.19.0, activado mediante la configuración `.nvmrc` del repositorio.
- `npm --prefix back test`: 114 pruebas correctas en 7 archivos.
- `npm --prefix back run lint`: correcto.
- `npm --prefix back run format:check`: correcto.
- `npm --prefix back run build`: correcto.
- `git diff --check`: correcto.

La implementación se limita al backend. No se ha implementado la especificación 003 ni se han realizado commits.
