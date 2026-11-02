# Seguimiento: Persistencia en el navegador

Estado: implementación y verificación completadas el 2026-11-02. Solicitada por el usuario el
2026-11-02.

- [x] Crear el adaptador de almacenamiento local con lectura, escritura e identificadores.
- [x] Crear el repositorio genérico con operaciones CRUD por identificador.
- [x] Migrar `LotApi` y `DeliveryApi` a almacenamiento local.
- [x] Traducir los fallos de lectura y escritura a mensajes accesibles.
- [x] Eliminar `provideHttpClient` del arranque del frontend.
- [x] Reescribir las pruebas unitarias de almacenamiento, repositorio, servicios, componentes y diálogos.
- [x] Reescribir las pruebas Gherkin y Playwright para usar datos del navegador.
- [x] Actualizar README y notas de despliegue.
- [x] Ejecutar lint, formato, pruebas unitarias, pruebas Gherkin y compilación.
- [x] Revisar accesibilidad y visualización móvil y de escritorio del flujo completo.

## Verificación realizada (Node 24.19.0, 2026-11-02)

- Pruebas unitarias del frontend: 85 pruebas en 13 ficheros, todas correctas.
- Pruebas Gherkin y Playwright: 41 escenarios y 367 pasos correctos, incluidos los cuatro escenarios
  de `persistencia.feature`.
- `npm run lint`: correcto.
- `npm run format:check`: correcto.
- `npm run build`: correcto.
- Accesibilidad y vista móvil: cubiertas por los escenarios de las especificaciones 003, 004 y 006.

## Decisiones de implementación

- Claves estables `a-la-par:lotes` y `a-la-par:entregas`.
- Una clave ausente equivale a una lista vacía; un JSON ilegible se informa como error de lectura.
- Un fallo de escritura se informa con un error y nunca se confirma como éxito.
- Cada registro se identifica por su `id`; los nombres y las fechas no se usan como clave.
- Las operaciones de inventario y entregas están aisladas entre sí.

## Limitaciones conocidas

- `localStorage` es específico del navegador y del perfil.
- Limpiar los datos del sitio elimina los registros.
- El espacio disponible es limitado y puede agotarse.
- No hay sincronización entre pestañas, dispositivos ni personas usuarias.
- No se incluyen copias de seguridad, exportación ni importación.
