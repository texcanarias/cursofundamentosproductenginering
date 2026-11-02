# Plan: Mejora de la visualización de datos en dispositivos

Estado: implementada y verificada el 2026-11-02. Solicitada por el usuario el 2026-11-02.

## Alcance y dependencias

- Depende de la identidad de marca "A la par" (especificación 004).
- Afecta a las vistas de inventario (especificación 003) y de entregas (especificación 006).
- No modifica la persistencia local del navegador (especificación 009) ni los contratos de datos.
- Sustituye la decisión de rejilla única de dos columnas por una rejilla adaptativa con prioridad
  móvil.

## Estrategia

1. Medir el estado actual con Playwright en 320, 375, 768, 1024 y 1440 px y documentar los
   desbordamientos, alturas y controles por debajo de 48 px.
2. Corregir primero la estructura y la jerarquía de las tarjetas; después la cabecera, la
   navegación, los formularios y los diálogos.
3. Verificar cada cambio con pruebas de integración y con capturas en los viewports de referencia.
4. Revisar accesibilidad con axe y con navegación por teclado antes de cerrar la especificación.

## Implementación

### 1. Tokens y estilos compartidos

- Añadir en `src/styles.scss` tokens de espacio, radio, ancho máximo de lectura y separación
  táctil, reutilizando la paleta existente.
- Definir puntos de ruptura únicos y documentarlos: 30rem (480 px), 48rem (768 px) y 64rem
  (1024 px), sin depender de dispositivos concretos.
- Asegurar `min-width: 0`, `overflow-wrap: anywhere` y `max-width: 100%` en los contenedores de
  texto y en la rejilla principal.

### 2. Tarjetas de inventario y entregas

- Reorganizar cada tarjeta en tres zonas: título, pares etiqueta-valor y acciones.
- Destacar el dato principal de cada tarjeta (caducidad en inventario, fecha en entregas) con un
  bloque propio, sin depender solo del color.
- Mostrar los pares etiqueta-valor en una columna en móvil y en dos cuando haya espacio.
- Evitar que las acciones se separen del contenido: barra de acciones a ancho completo en móvil
  y alineada a la derecha en pantallas mayores.
- Mantener las acciones visibles, con icono y texto alternativo accesible, y agruparlas en un
  `role="group"` con nombre cuando proceda.
- Conservar los atributos `data-lot-id` y `data-delivery-id` que usan las pruebas.

### 3. Cabecera, navegación y estructura

- Compactar la cabecera en móvil sin ocultar el nombre ni el descriptor de marca.
- Mantener la navegación en una fila desplazable solo si no cabe, sin scroll horizontal de la
  página, y con objetivos de 48 px.
- Revisar el `main` para que el ancho máximo de lectura no supere 72rem y el relleno se adapte.
- Respetar `env(safe-area-inset-*)` en la cabecera y en el contenido.

### 4. Formularios y diálogos

- Hacer que los campos ocupen todo el ancho disponible y que las acciones se apilen en móvil a
  ancho completo.
- Aumentar la separación entre etiquetas, ayudas y errores para que no se solapen con el texto
  ampliado.
- Ajustar los diálogos de eliminación con `max-width: calc(100vw - 2rem)` y botones apilados en
  móvil.
- Mantener el foco gestionado y el retorno de foco al cerrar.

### 5. Estados y contenido

- Revisar los estados de carga, vacío, error y aviso para que no cambien la anchura de la vista y
  se lean completos en móvil.
- Comprobar nombres largos de producto, ubicaciones y observaciones con datos de prueba realistas.
- Verificar fechas y estados de caducidad con textos que no dependan del color.

### 6. Pruebas

- Añadir pruebas unitarias de los componentes que verifiquen la estructura semántica y las clases
  de presentación.
- Añadir pruebas de integración con Playwright para 320, 375, 768, 1024 y 1440 px que comprueben
  ausencia de scroll horizontal y zonas táctiles mínimas.
- Añadir escenarios Gherkin en `visualizacion.feature` y sus pasos en `e2e/steps/`.
- Ejecutar axe en los viewports de referencia y con un producto de nombre largo.
- Revisar las pruebas existentes de las especificaciones 003, 004, 006 y 009 y ajustar selectores
  si cambia el marcado, sin reducir su cobertura.

### 7. Validación final

- Ejecutar `npm run lint`, `npm run format:check`, `npm test`, `npm run test:gherkin` y
  `npm run build`.
- Revisar manualmente en móvil, tablet y escritorio, con texto al 200 % y 400 %, teclado y
  orientación horizontal.
- Completar `seguimiento.md` con los resultados.

## Criterio de aceptación

Todos los escenarios de `visualizacion.feature` deben quedar cubiertos por pruebas automatizadas.
No debe existir desplazamiento horizontal entre 320 px y 1440 px, ningún control interactivo debe
medir menos de 48 × 48 px y la información esencial de cada tarjeta debe seguir visible sin abrir
el detalle.
