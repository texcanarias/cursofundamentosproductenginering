# Plan: Caducidad y localización de productos en el backend

Estado: especificación aceptada por el usuario el 2026-10-31. Implementación y verificación completadas el 2026-10-31.

## Alcance y contrato aprobado

- La unidad de gestión es una partida o lote, no un catálogo de productos separado.
- Cada lote contiene `id`, `nombreProducto`, `caducidad` y `ubicacion`.
- El backend genera un identificador estable y único. Los otros tres campos son obligatorios.
- Un producto puede repetirse en tantas partidas como sea necesario, incluso con datos coincidentes. No se agrupan ni se sobrescriben automáticamente.
- `caducidad` representa una fecha real sin hora, en formato `AAAA-MM-DD`. Se admiten fechas pasadas para registrar productos caducados.
- La ubicación es texto libre. No se incluye un catálogo de almacenes ni de ubicaciones.
- API JSON: `POST /api/lotes`, `GET /api/lotes`, `GET /api/lotes/{id}`, `PUT /api/lotes/{id}` y `DELETE /api/lotes/{id}`.
- POST y PUT reciben los tres campos editables. PUT sustituye todos ellos y conserva el identificador.
- GET de colección devuelve un array; POST, GET individual y PUT devuelven un objeto con los cuatro campos. DELETE no devuelve cuerpo.
- Los errores devuelven `{ "error": { "codigo": "...", "mensaje": "...", "campo": "..." } }`; `campo` solo es obligatorio para errores de validación.
- Quedan fuera cantidades, movimientos de stock, autenticación, ordenación FEFO y sincronización sin conexión.

## Implementación prevista

1. Revisión y aprobación completadas el 2026-10-31.
2. Modelar la partida y sus validaciones en el dominio, siguiendo DDD y TypeScript.
3. Definir los casos de uso CRUD y el puerto de repositorio en aplicación.
4. Implementar el repositorio mediante el adaptador CSV existente, conservando identificadores y caracteres especiales.
5. Exponer el contrato HTTP y traducir errores de validación, ausencia y persistencia.
6. Añadir pruebas unitarias del dominio y los casos de uso.
7. Añadir pruebas de integración HTTP y CSV, incluyendo reinicio y aislamiento entre partidas.
8. Verificar los escenarios Gherkin, lint, formato y compilación tras autorizar la implementación.

## Criterio de aceptación

Todos los escenarios de `productos.feature` deben quedar cubiertos por pruebas automatizadas. Mantener métodos de hasta 20 líneas y ficheros de aproximadamente 200 líneas, conforme a las instrucciones del repositorio.
