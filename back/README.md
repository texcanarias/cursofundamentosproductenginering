# Backend

Backend Node.js/TypeScript con límites DDD y persistencia CSV detrás de un puerto.

```bash
npm ci
npm run dev
npm test
npm run build
npm run lint
```

## Inventario de partidas

La API mantiene `GET /api/health` e incorpora el CRUD de la especificación 002:

| Método | Ruta | Resultado |
| --- | --- | --- |
| POST | `/api/lotes` | 201 con la partida creada |
| GET | `/api/lotes` | 200 con un array de partidas |
| GET | `/api/lotes/{id}` | 200 con la partida solicitada |
| PUT | `/api/lotes/{id}` | 200 con la partida actualizada |
| DELETE | `/api/lotes/{id}` | 204 sin cuerpo |

POST y PUT reciben los tres campos obligatorios:

```json
{
	"nombreProducto": "Arroz",
	"caducidad": "2027-03-15",
	"ubicacion": "Almacén A, balda 2"
}
```

Cada respuesta de partida incluye además un `id` generado por el servidor. PUT conserva el identificador de la ruta y requiere los tres campos, no una actualización parcial. Dos partidas pueden compartir todos sus datos sin fusionarse.

La caducidad debe ser una fecha real en formato `AAAA-MM-DD`, sin hora ni zona horaria. Se admiten fechas pasadas; nombre y ubicación no pueden estar vacíos ni contener solo espacios.

Los errores son JSON con la estructura `{ "error": { "codigo": "...", "mensaje": "..." } }`. Los errores de validación devuelven 400 y añaden `campo`; las partidas inexistentes devuelven 404 y los fallos de almacenamiento, 500. Un cuerpo JSON mal formado también devuelve 400.

## Registro de entregas a familias

La API incorpora el CRUD de la especificación 005, persistido en `back/data/entregas.csv`:

| Método | Ruta | Resultado |
| --- | --- | --- |
| POST | `/api/entregas` | 201 con la entrega creada |
| GET | `/api/entregas` | 200 con un array de entregas |
| GET | `/api/entregas/{id}` | 200 con la entrega solicitada |
| DELETE | `/api/entregas/{id}` | 204 sin cuerpo |

POST recibe `familiaId` y `fecha` (obligatorios) y `observacion` (opcional):

```json
{
	"familiaId": "FAM-001",
	"fecha": "2026-10-31",
	"observacion": "Entrega completa"
}
```

Cada respuesta de entrega incluye `id`, `familiaId`, `fecha` y `observacion`. La observación ausente se devuelve como cadena vacía. La fecha debe ser un día real en formato `AAAA-MM-DD`, sin hora ni zona horaria; se admiten fechas pasadas. Se pueden registrar varias entregas para la misma familia, incluso en la misma fecha, sin agruparlas ni sobrescribirlas.

Los errores de validación devuelven 400 con `campo` (`familiaId`, `fecha` u `observacion`); las entregas inexistentes devuelven 404 tanto al consultar como al eliminar.

## Persistencia y pruebas

Ejecutando los scripts desde `back/`, las partidas se guardan en `back/data/lotes.csv` y las entregas en `back/data/entregas.csv`. Las variables `LOTES_CSV_PATH` y `ENTREGAS_CSV_PATH` permiten configurar otras rutas, relativas al directorio de ejecución o absolutas.

Las escrituras se serializan dentro de una instancia del backend y reutilizan el reemplazo mediante archivo temporal del adaptador CSV. Esta solución está pensada para un solo proceso escritor por archivo, no para varios procesos compartiendo el CSV.

`npm test` incluye pruebas unitarias del dominio y los casos de uso, además de pruebas de integración HTTP con CSV temporales que cubren los escenarios Gherkin de las especificaciones 002 y 005. Estas pruebas no usan datos reales ni requieren arrancar un servidor por separado.