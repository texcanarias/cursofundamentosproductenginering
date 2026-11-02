# Plan: Persistencia en el navegador

Estado: en implementación. Solicitada por el usuario el 2026-11-02.

## Alcance y dependencias

- Sustituye la persistencia HTTP de las especificaciones 003 y 006 por almacenamiento local del navegador.
- Mantiene los contratos de `LotApi` y `DeliveryApi` para que las vistas no cambien de flujo.
- Depende de la identidad de marca "A la par" (especificación 004).

## Implementación

1. Crear un adaptador de bajo nivel sobre `localStorage` con lectura, escritura e identificadores.
2. Crear un repositorio genérico que implemente listar, consultar, crear, actualizar y eliminar.
3. Hacer que `LotApi` y `DeliveryApi` deleguen en el repositorio con sus claves independientes.
4. Traducir los fallos de almacenamiento a errores con estado y mensajes accesibles en español.
5. Mostrar errores de lectura sin presentar la vista como vacía y conservar los formularios ante fallos de escritura.
6. Eliminar el cliente HTTP del frontend y actualizar la documentación de despliegue.
7. Reescribir las pruebas unitarias de servicios, repositorio, almacenamiento y componentes.
8. Adaptar las pruebas Gherkin y Playwright para sembrar y verificar datos en el navegador.
9. Verificar teclado, accesibilidad, vista móvil, lint, formato, pruebas y compilación.

## Criterio de aceptación

Todos los escenarios de `persistencia.feature`, `productos.feature` y `entregas.feature` deben
quedar cubiertos por pruebas automatizadas. Mantener métodos de hasta 20 líneas y ficheros de
aproximadamente 200 líneas, conforme a las instrucciones del repositorio.
