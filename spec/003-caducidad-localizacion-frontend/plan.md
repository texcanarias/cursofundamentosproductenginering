# Plan: Caducidad y localización de productos en el frontend

Estado: especificación aceptada por el usuario el 2026-10-31. Implementación y verificación
completadas el 2026-11-01. Persistencia migrada al navegador el 2026-11-02.

## Alcance y dependencias

- Dependió del contrato del backend definido en la especificación 002, sustituido posteriormente por
  persistencia local según la especificación 009.
- Gestiona partidas independientes mediante su identificador.
- Incluye inventario, detalle, alta, edición y eliminación con confirmación.
- Los formularios contienen nombre del producto, fecha de caducidad y ubicación, todos obligatorios.
- La fecha se intercambia como `AAAA-MM-DD`, sin conversiones que cambien el día.
- Incluye estados de carga, inventario vacío, validación, éxito, error y partida inexistente.
- Mantiene Angular 22, Angular Material, estructura semántica, accesibilidad, enfoque mobile-first
  y configuración PWA existentes.
- La persistencia es local al navegador (`localStorage`). No se sincroniza entre dispositivos.

## Implementación prevista (realizada)

1. Definir el modelo de partida y el servicio de persistencia en el navegador.
2. Incorporar la vista de inventario y el detalle a la navegación existente.
3. Crear formularios accesibles de alta y edición con validación de los tres campos.
4. Incorporar la confirmación de eliminación y la gestión del foco.
5. Gestionar carga, validación, errores y recuperación sin perder los datos introducidos.
6. Añadir pruebas unitarias de formularios, fechas, almacenamiento y estados de componentes.
7. Adaptar las pruebas Gherkin para usar `localStorage`.
8. Verificar teclado, lector de pantalla, vista móvil, lint, formato y compilación.

## Criterio de aceptación

Todos los escenarios de `productos.feature` deben quedar cubiertos por pruebas automatizadas,
complementadas con revisión de accesibilidad. Mantener métodos de hasta 20 líneas y ficheros de
aproximadamente 200 líneas, conforme a las instrucciones del repositorio.

