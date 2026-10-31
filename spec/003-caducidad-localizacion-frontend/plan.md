# Plan: Caducidad y localización de productos en el frontend

Estado: especificación aceptada por el usuario el 2026-10-31. Implementación no iniciada.

## Alcance y dependencias

- Depende del contrato del backend definido en la especificación 002, aceptada el 2026-10-31.
- Gestiona partidas independientes mediante su identificador, aunque compartan nombre, caducidad o ubicación.
- Incluye inventario, detalle, alta, edición y eliminación con confirmación.
- Los formularios contienen nombre del producto, fecha de caducidad y ubicación, todos obligatorios.
- La fecha se presenta en formato legible según la configuración regional, pero se intercambia como `AAAA-MM-DD`, sin conversiones que cambien el día.
- Incluye estados de carga, inventario vacío, validación, éxito, error y partida inexistente.
- Mantiene Angular 22, Angular Material, estructura semántica, accesibilidad, enfoque mobile-first y configuración PWA existentes.
- El CRUD requiere conexión al backend. No se incluyen almacenamiento local de partidas, escrituras sin conexión ni sincronización posterior.
- Quedan fuera cantidades, movimientos de stock, búsqueda, filtros, ordenación FEFO y catálogos de ubicaciones.

## Implementación prevista

1. Revisión y aprobación de esta especificación y su dependencia del contrato 002 completadas el 2026-10-31.
2. Definir el modelo de partida y el servicio HTTP para los cinco endpoints del contrato.
3. Incorporar la vista de inventario y el detalle a la navegación existente.
4. Crear formularios accesibles de alta y edición con validación de los tres campos.
5. Incorporar la confirmación de eliminación y la gestión del foco.
6. Gestionar carga, envíos duplicados, errores y recuperación sin perder los datos introducidos.
7. Añadir pruebas unitarias de formularios, fechas, servicio HTTP y estados de componentes.
8. Añadir pruebas de integración frontend-backend y automatizar los escenarios Gherkin.
9. Verificar teclado, lector de pantalla, vista móvil, lint, formato y compilación tras autorizar la implementación.

## Criterio de aceptación

Todos los escenarios de `productos.feature` deben quedar cubiertos por pruebas automatizadas, complementadas con revisión de accesibilidad. Mantener métodos de hasta 20 líneas y ficheros de aproximadamente 200 líneas, conforme a las instrucciones del repositorio.
