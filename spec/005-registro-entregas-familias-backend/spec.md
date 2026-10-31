# Especificación: Registro de entregas de ayuda alimentaria a familias (backend)

## Objetivo

Permitir registrar en el backend que se ha entregado ayuda alimentaria a una familia concreta en una fecha concreta, con persistencia en fichero CSV.

## Alcance

- Modelo de entrega en el dominio, siguiendo DDD y TypeScript.
- Casos de uso: registrar entrega, consultar listado, consultar por identificador y eliminar entrega.
- Puerto de repositorio e implementación mediante adaptador CSV.
- Endpoints HTTP: `POST /api/entregas`, `GET /api/entregas`, `GET /api/entregas/{id}` y `DELETE /api/entregas/{id}`.
- Validaciones: `familiaId` obligatorio, `fecha` obligatoria y válida (`AAAA-MM-DD`), `observacion` opcional.
- Errores con formato `{ "error": { "codigo": "...", "mensaje": "...", "campo": "..." } }`; `campo` solo obligatorio en errores de validación.
- Persistencia en CSV, identificadores estables y únicos, conservación de caracteres especiales.
- Se admiten fechas pasadas para registrar entregas ya realizadas.
- No se agrupan ni sobrescriben entregas automáticamente; cada entrega es independiente.

Quedan fuera: cantidades de productos, tipos de ayuda, autenticación, cálculo de prioridad, turno rotativo, frontend, almacenamiento sin conexión ni sincronización posterior.

## Contrato HTTP aprobado

- `POST /api/entregas`: recibe `familiaId` y `fecha` (obligatorios), `observacion` (opcional). Devuelve el objeto creado con los cuatro campos (`id`, `familiaId`, `fecha`, `observacion`).
- `GET /api/entregas`: devuelve un array de entregas.
- `GET /api/entregas/{id}`: devuelve un objeto con los cuatro campos.
- `DELETE /api/entregas/{id}`: no devuelve cuerpo.

## Reglas de negocio

- Cada entrega recibe un identificador estable y único generado por el backend.
- `familiaId` es texto libre que identifica a la familia; no existe un catálogo separado de familias en esta especificación.
- `fecha` representa un día real sin hora, en formato `AAAA-MM-DD`.
- Se pueden registrar varias entregas para la misma familia, incluso en la misma fecha.
- Las fechas pasadas son válidas para registrar entregas ya realizadas.

## Criterios de aceptación

Todos los escenarios de `entregas.feature` deben quedar cubiertos por pruebas automatizadas (unitarias e integración HTTP/CSV) en el backend. Mantener métodos de hasta 20 líneas y ficheros de aproximadamente 200 líneas, conforme a las instrucciones del repositorio.
