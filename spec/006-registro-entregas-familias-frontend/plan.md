# Plan: Registro de entregas de ayuda alimentaria a familias (frontend)

Estado: especificación aceptada por el usuario el 2026-10-31. Implementación no iniciada.

## Alcance y dependencias

- Depende del contrato del backend definido en la especificación 005, aceptada el 2026-10-31.
- Depende de la identidad de marca "A la par" (especificación 004), aprobada el 2026-10-31.
- Gestiona entregas independientes mediante su identificador backend.
- El CRUD requiere conexión al backend. No se incluyen almacenamiento local de entregas, escrituras sin conexión ni sincronización posterior.

## Implementación prevista

1. Revisión y aprobación de esta especificación y su dependencia del backend 005 y la identidad de marca 004.
2. Definir el modelo de entrega y el servicio HTTP para los cuatro endpoints del contrato.
3. Incorporar la vista de listado y el detalle a la navegación existente.
4. Crear formularios accesibles de alta con validación de identificador de familia y fecha.
5. Incorporar la confirmación de eliminación y la gestión del foco.
6. Gestionar carga, envíos duplicados, errores y recuperación sin perder los datos introducidos.
7. Añadir pruebas unitarias de formularios, fechas, servicio HTTP y estados de componentes.
8. Añadir pruebas de integración frontend-backend y automatizar los escenarios Gherkin.
9. Verificar teclado, lector de pantalla, vista móvil, lint, formato y compilación tras autorizar la implementación.

## Criterio de aceptación

Todos los escenarios de `entregas.feature` deben quedar cubiertos por pruebas automatizadas, complementadas con revisión de accesibilidad. Mantener métodos de hasta 20 líneas y ficheros de aproximadamente 200 líneas, conforme a las instrucciones del repositorio.
