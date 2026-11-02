# Especificación: Mejora de la visualización de datos en dispositivos

Estado: implementada y verificada el 2026-11-02. Solicitada por el usuario el 2026-11-02 a partir de la
detección del ICP tras la puesta en producción.

## Objetivo

Mejorar la lectura y el uso de las pantallas de inventario y entregas en dispositivos reales,
priorizando móviles y tablets. La información esencial debe verse completa, ordenada y sin
desplazamientos horizontales, incluso con texto ampliado, y las acciones deben poder pulsarse
con comodidad.

## Contexto

Tras la puesta en producción, el ICP ha comprobado que los usuarios finales no ven del todo bien
la pantalla. Las causas observadas son:

- Las tarjetas de inventario y entregas presentan los datos con el mismo peso visual, de modo que
  la caducidad y la ubicación cuestan de localizar en una lectura rápida.
- Las etiquetas y los valores se apilan sin jerarquía en pantallas estrechas, alargando cada
  tarjeta y obligando a desplazarse para comparar partidas.
- Los botones de acción se reparten en varias líneas en móviles pequeños y algunos quedan
  demasiado juntos o fuera del área cómoda del pulgar.
- Los textos largos (nombres de producto, ubicaciones y observaciones) pueden desbordar o forzar
  la anchura de la tarjeta.
- La cabecera y la navegación ocupan demasiado espacio vertical en móvil antes de llegar a los
  datos.
- La visualización no se ha validado con texto ampliado, orientación horizontal ni tablets
  reales.

## Alcance

- Rediseñar la presentación de las tarjetas de inventario y entregas para móviles y tablets.
- Definir una jerarquía visual explícita por tipo de dato:
  - Inventario: nombre del producto, caducidad con su estado textual, ubicación y acciones.
  - Entregas: identificador de familia, fecha de entrega, observación y acciones.
- Mostrar los datos como pares etiqueta-valor legibles, siempre en una sola columna dentro de cada
  tarjeta, sin tablas que obliguen a desplazamiento horizontal.
- Mantener siempre visibles y accesibles las acciones principales de cada tarjeta.
- Adaptar la cabecera, la navegación y los formularios a pantallas pequeñas.
- Permitir lectura cómoda con texto ampliado al 200 % y reflujo sin pérdida de contenido al 400 %.
- Respetar áreas seguras de la pantalla y la orientación vertical y horizontal.
- Reutilizar los tokens y la identidad de marca "A la par" (especificación 004).
- Cubrir los cambios con pruebas unitarias, de integración, Gherkin y Playwright.

## Fuera de alcance

- Cambiar los datos, los campos o los flujos funcionales de inventario y entregas.
- Añadir nuevas pantallas, filtros, búsquedas, ordenaciones o vistas de calendario.
- Implementar el asistente de la Regla de las 3 Cajas, el padrón de familias, la prioridad, el
  turno rotativo, los mensajes de WhatsApp o la inducción exprés.
- Modo de vista simplificada con menú persistente; queda para su especificación funcional.
- Sincronización, exportación o cambios en la persistencia del navegador (especificación 009).
- Cambiar la identidad de marca, la paleta, la tipografía o los activos aprobados.

## Puntos de ruptura y rangos de pantalla

Se toman como referencia los siguientes anchos, sin tratarlos como dispositivos concretos:

| Rango                         | Ancho útil    | Comportamiento esperado                                               |
| ----------------------------- | ------------- | --------------------------------------------------------------------- |
| Móvil pequeño                 | 320–479 px    | Una columna, acciones a ancho completo, sin desplazamiento horizontal |
| Móvil grande                  | 480–767 px    | Una columna con los datos apilados dentro de cada tarjeta             |
| Tablet vertical               | 768–1023 px   | Dos columnas de tarjetas y formularios de anchura legible             |
| Tablet horizontal u ordenador | 1024 px o más | Hasta tres columnas de tarjetas y contenido centrado con ancho máximo |

- El ancho mínimo soportado es 320 px de viewport.
- Ninguna vista debe generar desplazamiento horizontal entre 320 px y 1440 px.
- El contenido debe refluír al 400 % de ampliación sin ocultar datos ni acciones.

## Jerarquía y presentación de datos

### Inventario

1. Nombre del producto como título de la tarjeta, con hasta 3 líneas y sin truncar.
2. Caducidad como dato destacado, con fecha legible y estado textual («Caducado», «Caduca en 7
   días», «Caduca en 20 días», «Sin caducidad próxima»), nunca solo con color.
3. Ubicación con la etiqueta «Dónde está», visible sin abrir el detalle.
4. Acciones de ver, editar y eliminar con nombre accesible y zona táctil de 48 × 48 px.

### Entregas

1. Identificador de familia como título de la tarjeta.
2. Fecha de entrega como dato destacado, en formato legible y con `datetime` correcto.
3. Observación con la etiqueta «Observación»; si está vacía, se muestra «Sin observación».
4. Acciones de ver y eliminar con nombre accesible y zona táctil de 48 × 48 px.

### Reglas comunes

- Cada tarjeta conserva su estructura semántica de artículo, título y lista de definiciones.
- Las etiquetas se distinguen de los valores por peso y color, manteniendo contraste WCAG 2.2 AA.
- Los textos largos se parten con `overflow-wrap` y no amplían la tarjeta.
- La información no se oculta tras interacciones ni se recorta con puntos suspensivos.
- Las acciones destructivas se diferencian visual y textualmente de las demás.
- No se comunica ningún estado únicamente mediante color.

## Accesibilidad y uso táctil

- Texto general de 18 px y nunca inferior a 16 px; las etiquetas mantienen al menos 16 px.
- Controles interactivos de al menos 48 × 48 px, con separación mínima de 8 px entre ellos.
- Orden de tabulación coherente con el orden visual y foco visible en todos los controles.
- La navegación por teclado y el enlace «Saltar al contenido» siguen funcionando.
- Los cambios de orientación y de tamaño no pierden foco ni contenido.
- Los mensajes de estado y de error siguen anunciándose con `role="status"` o `role="alert"`.
- La cabecera no tapa el contenido al ampliar el texto y mantiene el nombre de marca legible.

## Criterios de aceptación

Todos los escenarios de `visualizacion.feature` deben quedar cubiertos por pruebas automatizadas
(unitarias y de integración con Vitest, Gherkin con Cucumber y Playwright) y por revisión manual
en viewports de 320, 375, 768, 1024 y 1440 px, en orientación vertical y horizontal. Se deben
mantener métodos de hasta 20 líneas y ficheros de aproximadamente 200 líneas, conforme a las
instrucciones del repositorio, y superar lint, formato, pruebas y compilación.

## Métricas de éxito

- Cero desplazamientos horizontales en las rutas `/inventario` y `/entregas` en todos los
  viewports de referencia.
- Las cuatro acciones principales (añadir producto, registrar entrega, ver y eliminar) son
  alcanzables sin desplazamiento horizontal y con una sola mano en un móvil de 375 px.
- La caducidad y la ubicación se identifican en menos de 5 segundos en una prueba rápida con
  personas voluntarias.
- Ninguna prueba de accesibilidad automatizada (axe) detecta violaciones graves o críticas.
- Los escenarios Gherkin de las especificaciones 003, 004, 006 y 009 siguen pasando.
