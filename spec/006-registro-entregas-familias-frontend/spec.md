# Especificación: Registro de entregas de ayuda alimentaria a familias (frontend)

## Objetivo

Permitir que una persona voluntaria registre, consulte y elimine entregas de ayuda alimentaria a familias desde una interfaz accesible en Angular.

## Alcance y dependencias

- Depende del contrato del backend definido en la especificación 005, aceptada el 2026-10-31.
- Depende de la identidad de marca "A la par" (especificación 004), aprobada el 2026-10-31.
- Angular 22, Angular Material, PWA, enfoque mobile-first, HTML semántico y accesibilidad web.
- Vistas: listado de entregas, detalle, formulario de alta y confirmación de eliminación.
- Campos: identificador de familia, fecha de entrega y observación opcional.
- La fecha se presenta en formato legible según la configuración regional, pero se intercambia como `AAAA-MM-DD`, sin conversiones que cambien el día.
- Estados: carga, listado vacío, validación, éxito, error y entrega inexistente.
- Accesibilidad: etiquetas en todos los campos, controles con nombres accesibles, foco visible y gestionado al abrir/cerrar confirmaciones, navegación por teclado, lectores de pantalla.
- Textos de al menos 16 píxeles (general 18 píxeles) y controles interactivos de al menos 48 por 48 píxeles.
- No comunicar estados únicamente mediante color; no usar amarillo sobre blanco para información esencial.
- No incluye: cantidades de productos, tipos de ayuda, cálculo de prioridad, turno rotativo, mensajes de WhatsApp, almacenamiento sin conexión ni sincronización posterior.

Queda fuera cualquier flujo que no sea el CRUD visual de entregas de esta especificación.

## Contrato consumido

- `POST /api/entregas` — registra una entrega.
- `GET /api/entregas` — consulta el listado.
- `GET /api/entregas/{id}` — consulta una entrega por identificador.
- `DELETE /api/entregas/{id}` — elimina una entrega.

## Reglas de interacción

- Cada entrega se identifica por su identificador backend, no por el identificador de familia.
- Al registrar, se muestra confirmación accesible del guardado.
- Al eliminar, se muestra confirmación que identifica la entrega antes de borrar.
- Los errores de validación se asocian a los campos afectados y pueden ser anunciados por un lector de pantalla.
- Los valores del formulario se conservan ante errores de guardado o edición.
- No se confirma ni encola escritura sin conexión con el backend.

## Criterios de aceptación

Todos los escenarios de `entregas.feature` deben quedar cubiertos por pruebas automatizadas (unitarias, de integración frontend-backend y Gherkin), complementadas con revisión de accesibilidad. Mantener métodos de hasta 20 líneas y ficheros de aproximadamente 200 líneas, conforme a las instrucciones del repositorio.
