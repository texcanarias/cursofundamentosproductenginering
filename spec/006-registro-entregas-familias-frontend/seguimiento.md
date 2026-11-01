# Seguimiento: Registro de entregas de ayuda alimentaria a familias (frontend)

Estado: especificación aprobada por el usuario el 2026-10-31. Implementación y verificación completadas el 2026-11-01.

- [x] Redactar la especificación Gherkin del CRUD visual. (hecho: entregas.feature)
- [x] Redactar el plan y explicitar la dependencia del backend 005 y la identidad de marca 004. (hecho: plan.md, spec.md)
- [x] Revisar y aprobar flujos, campos, estados y criterios de accesibilidad. (aprobado por el usuario el 2026-10-31)
- [x] Implementar modelo y servicio HTTP.
- [x] Implementar listado, detalle, formulario de alta y confirmación de eliminación.
- [x] Implementar estados de carga, validación y recuperación de errores.
- [x] Añadir pruebas unitarias, de integración y escenarios Gherkin automatizados.
- [x] Verificar accesibilidad, vista móvil, lint, formato y compilación.

## Cobertura de aceptación

Los escenarios de `entregas.feature` se automatizan con Cucumber y Playwright contra el frontend y el backend reales, y se complementan con pruebas Vitest de componentes, formularios, fechas y contrato HTTP.

| Escenarios Gherkin                                                              | Pruebas automatizadas                                                                 |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Consultar las entregas registradas                                              | `deliveries-navigation.steps.cjs` y `deliveries-page.spec.ts`                         |
| Distinguir varias entregas de una misma familia                                 | `deliveries-navigation.steps.cjs`                                                     |
| Mostrar un listado vacío                                                        | `deliveries-navigation.steps.cjs` y `deliveries-page.spec.ts`                         |
| Crear una entrega                                                               | `deliveries-edit.steps.cjs` y `delivery-form.spec.ts`                                 |
| Consultar el detalle de una entrega                                             | `deliveries-navigation.steps.cjs` y `deliveries-page.spec.ts`                         |
| Cancelar un formulario sin guardar                                              | `deliveries-edit.steps.cjs` y `delivery-form.spec.ts`                                 |
| Validar el formulario                                                           | `delivery-form.spec.ts` y `delivery.spec.ts`                                          |
| Admitir fechas pasadas sin desplazarlas por zona horaria                        | `delivery.spec.ts`, `delivery-form.spec.ts` y `deliveries-edit.steps.cjs`             |
| Confirmar la eliminación de una entrega                                         | `deliveries-delete.steps.cjs` y `delete-delivery-dialog.spec.ts`                      |
| Cancelar la eliminación                                                         | `deliveries-delete.steps.cjs` y `delete-delivery-dialog.spec.ts`                      |
| Mostrar carga y evitar envíos duplicados                                        | `inventory-state.steps.cjs` y `delivery-form.spec.ts`                                 |
| Recuperarse de un error al consultar                                            | `inventory-state.steps.cjs` y `deliveries-page.spec.ts`                               |
| Recuperarse de un error al guardar o eliminar                                   | `deliveries-state.steps.cjs`, `deliveries-page.spec.ts` y `delete-delivery-dialog.spec.ts` |
| Informar de una entrega que ya no existe                                        | `deliveries-state.steps.cjs`, `deliveries-page.spec.ts` y `delete-delivery-dialog.spec.ts` |
| Utilizar el listado desde móvil y con tecnologías de apoyo                      | `deliveries-accessibility.steps.cjs`, `keyboard.cjs` y `accessibility.cjs`            |
| No confirmar cambios sin conexión                                               | `deliveries-state.steps.cjs` y `delete-delivery-dialog.spec.ts`                       |

Se añaden pruebas del contrato HTTP en `delivery-api.spec.ts`, de las utilidades compartidas de fecha y error, y de la navegación por secciones en `app.spec.ts`.

## Verificación realizada

- Node 24.19.0, activado mediante `nvm use 24.19.0`.
- `npm --prefix front test`: 76 pruebas correctas en 11 archivos.
- `npm --prefix front run test:gherkin`: 41 escenarios y 369 pasos correctos, incluida la especificación 006.
- `npm --prefix front run lint`: correcto.
- `npm --prefix front run format:check`: correcto.
- `npm --prefix front run build`: correcto.
- Revisión automatizada con axe (WCAG 2.2 AA), teclado, foco visible, controles de 48 × 48 píxeles y vista de 320 píxeles.

La implementación respeta la identidad "A la par", reutiliza los tokens y activos de marca y no introduce almacenamiento local ni sincronización sin conexión. No se han realizado commits.
