# Plan: Registro de entregas de ayuda alimentaria a familias (frontend)

Estado: especificación aceptada por el usuario el 2026-10-31. Implementación y verificación
completadas el 2026-11-01. Persistencia migrada al navegador el 2026-11-02.

## Alcance y dependencias

- Dependió del contrato del backend definido en la especificación 005, sustituido posteriormente por
  persistencia local según la especificación 009.
- Depende de la identidad de marca "A la par" (especificación 004), aprobada el 2026-10-31.
- Gestiona entregas independientes mediante su identificador.
- El CRUD usa almacenamiento local del navegador (`localStorage`). No se sincroniza entre
  dispositivos.
- La fecha se intercambia como `AAAA-MM-DD`, sin conversiones que cambien el día.

## Implementación prevista (realizada)

1. Definir el modelo de entrega y el servicio de persistencia en el navegador.
2. Incorporar la vista de listado y el detalle a la navegación existente.
3. Crear formularios accesibles de alta con validación de identificador de familia y fecha.
4. Incorporar la confirmación de eliminación y la gestión del foco.
5. Gestionar validación, errores y recuperación sin perder los datos introducidos.
6. Añadir pruebas unitarias de formularios, fechas, almacenamiento y estados de componentes.
7. Adaptar las pruebas Gherkin para usar `localStorage`.
8. Verificar teclado, lector de pantalla, vista móvil, lint, formato y compilación.

## Criterio de aceptación

Todos los escenarios de `entregas.feature` deben quedar cubiertos por pruebas automatizadas,
complementadas con revisión de accesibilidad. Mantener métodos de hasta 20 líneas y ficheros de
aproximadamente 200 líneas, conforme a las instrucciones del repositorio.

