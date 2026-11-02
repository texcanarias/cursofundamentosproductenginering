# Especificación: Persistencia en el navegador

Estado: en implementación. Solicitada por el usuario el 2026-11-02.

## Objetivo

Conservar el inventario y las entregas en el propio navegador para que la aplicación funcione
sin depender del backend, sobreviva a recargas y pueda desplegarse como sitio estático.

## Alcance

- Persistir partidas de inventario y entregas en `localStorage`.
- Usar claves propias y estables (`a-la-par:lotes` y `a-la-par:entregas`) para no mezclar datos.
- Generar identificadores únicos en el navegador para cada registro nuevo.
- Mantener las interfaces de los servicios (`list`, `get`, `create`, `update`, `delete`) para no
  alterar los componentes ni los flujos existentes.
- Informar de errores de lectura o escritura sin presentar datos vacíos ni confirmar cambios perdidos.
- Mantener los datos al recargar la página y respetar la separación entre inventario y entregas.
- Reutilizar la identidad de marca "A la par" y los criterios de accesibilidad de las
  especificaciones 003, 004 y 006.

## Fuera de alcance

- Sincronización entre pestañas, dispositivos o personas usuarias.
- Copias de seguridad, exportación o importación de datos.
- Autenticación y control de acceso a los datos guardados.
- Persistencia en el backend y migración automática de los CSV del servidor.
- Escrituras en segundo plano o colas de sincronización.

## Contrato de almacenamiento

| Clave               | Contenido                                  |
| ------------------- | ------------------------------------------ |
| `a-la-par:lotes`     | Lista JSON de partidas con `id` y sus campos |
| `a-la-par:entregas`  | Lista JSON de entregas con `id` y sus campos |

- Una clave ausente representa una lista vacía.
- Un JSON ilegible se considera un error de lectura, no una lista vacía.
- Un fallo de escritura se comunica como error y no debe confirmarse como éxito.
- Cada registro se identifica por su `id`; las operaciones nunca usan nombres ni fechas como clave.

## Riesgos y límites

- `localStorage` es específico del navegador y del perfil; limpiar los datos del sitio elimina los registros.
- El espacio disponible es limitado y puede agotarse.
- Los datos no se comparten entre dispositivos ni entre personas que usen navegadores distintos.
- La información es accesible desde el propio navegador, por lo que no debe usarse para datos sensibles
  sin las medidas de seguridad correspondientes.
