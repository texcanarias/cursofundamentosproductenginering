# Seguimiento: Mejora de la visualización de datos en dispositivos

Estado: implementación y verificación automatizada completadas el 2026-11-02. Solicitada por el
usuario el 2026-11-02 a partir de la detección del ICP tras la puesta en producción.

## Diagnóstico inicial

- [x] Medir los viewports 320, 375, 768, 1024 y 1440 px.
- [x] Registrar desbordamientos horizontales, alturas de tarjeta y controles menores de 48 px.
- [x] Revisar con texto al 200 % y reflujo a 320 px CSS (equivalente al 400 % de ampliación).
- [x] Priorizar la caducidad y la fecha como datos principales de cada tarjeta.

## Implementación

- [x] Añadir estilos compartidos de tarjeta, campos, acciones y formularios.
- [x] Reorganizar las tarjetas de inventario con título, caducidad destacada, ubicación y acciones.
- [x] Reorganizar las tarjetas de entregas con título, fecha destacada, observación y acciones.
- [x] Adaptar la rejilla de tarjetas a una columna en móvil, dos en tablet y tres en escritorio.
- [x] Ajustar la petición posterior del usuario: los datos de cada tarjeta se muestran siempre en
      una sola columna interna, en cualquier tamaño de pantalla.
- [x] Compactar la cabecera y la navegación en móvil sin ocultar la marca.
- [x] Ajustar formularios, mensajes de estado y diálogos a pantallas estrechas.
- [x] Respetar las áreas seguras y el reflujo al ampliar el texto.
- [x] Revisar contrastes y estados sin depender únicamente del color.
- [x] Añadir el estado textual de caducidad FEFO («Caducado», «Caduca en 7 días», etc.).

## Pruebas

- [x] Añadir pruebas unitarias del estado de caducidad y de la estructura de las tarjetas.
- [x] Añadir pruebas Gherkin y Playwright para los viewports de referencia.
- [x] Añadir los pasos de `visualizacion.feature` en `e2e/steps/`.
- [x] Comprobar con Playwright la ausencia de desbordamiento en 320, 375, 768, 1024 y 1440 px.
- [x] Revisar y ajustar las pruebas de las especificaciones 003, 004, 006 y 009.

## Validación final

- [x] `npm run lint`.
- [x] `npm run format:check`.
- [x] `npm test`: 95 pruebas en 13 ficheros.
- [x] `npm run test:gherkin`: 55 escenarios y 480 pasos.
- [x] `npm run build`.

## Decisiones de implementación

- Se prioriza móvil y tablet; escritorio conserva el mismo sistema con más columnas.
- El ancho mínimo soportado es 320 px y el contenido no genera scroll horizontal.
- La caducidad y la fecha de entrega se destacan como dato principal de cada tarjeta.
- La información esencial de cada tarjeta se ve sin abrir el detalle.
- Las acciones se apilan a ancho completo en móvil y se agrupan con `role="group"`.
- Las tarjetas usan una rejilla de 1 columna por defecto, 2 desde 48 rem y 3 desde 64 rem.
- Los pares etiqueta-valor dentro de cada tarjeta permanecen siempre en una sola columna, también en
  tablet y escritorio, para mantener una lectura lineal y evitar comparaciones cruzadas.
- Se reutilizan los tokens de `src/styles.scss` y no se introducen colores ni tipografías nuevas.
- El estado de caducidad se muestra siempre con texto y se acompaña de color, nunca al revés.

## Riesgos conocidos

- La revisión con dispositivos reales y personas mayores o con baja visión sigue recomendada.
- Los tamaños de letra del sistema operativo pueden alterar la altura de las tarjetas; el contenido
  debe seguir refluando sin scroll horizontal.
- Los navegadores móviles con barras dinámicas pueden cambiar la altura visible; se usa `100dvh`
  y áreas seguras.
- Cambiar el marcado puede afectar a selectores de pruebas existentes; se actualizarán sin perder
  cobertura.
