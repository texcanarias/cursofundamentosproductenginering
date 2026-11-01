# AGENTS.md

## Repositorio

Usa este repositorio pero no hagas commits automáticos.

## Rol

Desarrollador fullstack

## Tecnologias a usar

El proyecto será basado en web con un back y un front separado.

Para el sistema de persistencia usa ficheros CSV.

El back debe usar:

- DDD
- typescript
- nodejs
- ficheros csv para persistencia

El front de usar:

- mobile-first
- semantic web
- accessibility web
- PWA
- Angular 22
- Angular Material para los componentes

## Identidad de marca obligatoria del frontend

La identidad **A la par**, definida en la especificación **004**, fue aprobada por el usuario el **2026-10-31**. Todas las implementaciones y modificaciones del frontend deben respetarla, incluidas las de la especificación 003 y las funcionalidades futuras.

- Antes de modificar el frontend, consultar la [guía de identidad](spec/004-identidad-marca/identidad.md) y sus [criterios de aceptación Gherkin](spec/004-identidad-marca/marca.feature). Aplicar el [skill de diseño de marca](.github/skills/diseno-marca-aplicacion/SKILL.md) cuando el trabajo afecte a la identidad visual o verbal.
- Mantener el nombre **A la par**, el descriptor **Gestión comunitaria**, el lema **Un equipo. Muchas manos.** y los activos de marca aprobados.
- Conservar un diseño alegre, optimista, colaborativo y adulto, orientado también a personas con poca experiencia digital, mayores y con dificultades visuales. Usar lenguaje sencillo y respetuoso, sin infantilizar.
- Reutilizar los tokens de [src/styles.scss](src/styles.scss), el tema Angular Material y los activos de [public/brand/](public/brand/). No introducir paletas, logotipos o estilos de marca alternativos sin aprobación explícita.
- Usar Atkinson Hyperlegible servida localmente; texto general de 18 píxeles, nunca inferior a 16 píxeles, y controles interactivos de al menos 48 por 48 píxeles. Permitir ampliación y salto de línea sin ocultar datos ni acciones.
- Mantener mobile-first, HTML semántico, etiquetas accesibles, navegación por teclado y foco visible. Verificar los contrastes conforme a WCAG 2.2 AA; no comunicar estados únicamente mediante color ni usar amarillo sobre blanco para información esencial.
- Mantener coherencia entre pantallas, formularios, mensajes, iconos y recursos PWA. La identidad no autoriza a inventar flujos fuera de la especificación funcional correspondiente.
- Al cambiar la interfaz, ejecutar las pruebas pertinentes, lint, formato y compilación; verificar accesibilidad y visualización móvil y de escritorio conforme al alcance del cambio.

## Guias de estilo

- No superar las 20 lineas por metodo
- Usar aprox 200 lineas por fichero
- Prettier
- ESlint
- Buenas prácticas

## Estructura

| Tecnología | Ruta   | Descripcion      |
| ---------- | ------ | ---------------- |
| (root)     | /      | Front (Angular)  |
| back       | back/  | Back             |
| spec       | spec/  | Especificaciones |

## Spec development

Las especificaciones deben numerarse en orden de creación.
Cada especificacion debe tener el fichero de especificacion, un plan y un fichero de seguimiento

## Test

Todas las features deben estar redactadas en Gherkin para poder testearlas

Deben usarse test unitarios

Deben hacerse test de integración

## La solución será

La aplicación incluirá:

    Interfaz accesible: Botones grandes, texto legible (+16px), modo de vista simplificada con menú persistente.

    Inventario FEFO: Clasificación colorimétrica (🔴 7 días, 🟡 8-30 días, 🟢 +30 días/No perecederos) con asistente guiado para la Regla de las 3 Cajas.

    Registro de Familias: Padrón digital visual, cálculo automático de prioridad (vulnerabilidad vs turno rotativo 15 días), registro rápido de entrega y generador de mensajes de WhatsApp.

    Inducción Exprés: Checklist interactivo en 3 pasos con temporizador visual para capacitar a voluntarios en menos de 5 minutos.
