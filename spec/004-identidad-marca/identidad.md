# A la par

**Un equipo. Muchas manos.**

![Logotipo aprobado de A la par: dos arcos que se encuentran junto al nombre.](../../front/public/brand/logotipo.svg)

Identidad creada y aprobada por el usuario el 2026-10-31. El nombre, el símbolo y el sistema visual y verbal son la referencia obligatoria para todas las implementaciones y modificaciones del frontend. La aprobación no implica registro de marca ni sustituye las comprobaciones legales o las pruebas con personas usuarias.

## Dirección de marca

- Propósito: hacer más claro y amable el trabajo compartido de las organizaciones comunitarias.
- Audiencia principal: personal y voluntariado, incluyendo personas mayores, con baja experiencia digital o dificultades visuales.
- Promesa de diseño: tareas comprensibles, trato digno y señales fáciles de reconocer.
- Personalidad: alegre sin ruido, optimista sin frivolidad, colaborativa y adulta.
- Diferenciación: la alegría aparece en el encuentro entre personas y en pequeños acentos cálidos, no en decoraciones que compiten con la tarea.

No se presupone una región, una organización concreta ni que las familias atendidas utilicen directamente la aplicación.

## Nombre y lenguaje

**A la par** expresa compañía, igualdad y coordinación. Es breve, fácil de decir y no define a las personas por una situación de necesidad. En texto se escribe siempre «A la par», sin siglas.

Descriptor: **Gestión comunitaria**. Firma de marca: **Un equipo. Muchas manos.** La firma pertenece a comunicaciones y cabecera, no a cada formulario o mensaje operativo.

La voz habla como una persona compañera de equipo: directa, respetuosa y tranquila. Frases cortas, verbos conocidos y una acción principal cada vez. Sin diminutivos, jerga administrativa, reproches ni celebraciones exageradas.

| Situación futura        | Texto propuesto                         | Evitar                          |
| ----------------------- | --------------------------------------- | ------------------------------- |
| Alta de una partida     | Añadir producto                         | Alta de entidad / Crear SKU     |
| Campo de ubicación      | Dónde está                              | Localización logística          |
| Guardado confirmado     | Producto guardado                       | ¡Eres increíble!                |
| Fallo al guardar        | No se pudo guardar. Inténtalo de nuevo. | Has cometido un error           |
| Confirmación de borrado | ¿Eliminar esta partida de Arroz?        | ¿Estás seguro?                  |
| Atención a familias     | Familias / Próxima entrega              | Beneficiarios problemáticos     |
| Inducción               | Paso 1 de 3                             | Nivel básico para principiantes |

Estos ejemplos orientan pantallas futuras. No implican que esos flujos estén implementados ni prometen conservar datos o sincronizarlos sin que el producto lo garantice.

## Logotipo: el encuentro

Dos arcos abiertos, uno verde y otro amarillo, se encuentran en una pieza coral. Sugieren dos personas trabajando juntas y un lugar compartido, sin representar una comunidad o cultura concreta. El símbolo no sustituye etiquetas ni explica estados de inventario.

- Símbolo vectorial: `front/public/brand/simbolo.svg`.
- Composición horizontal editable: `front/public/brand/logotipo.svg`.
- En la interfaz, el símbolo acompaña al nombre escrito como texto real, con la tipografía local.
- El SVG horizontal usa Atkinson Hyperlegible cuando está disponible y Verdana como alternativa. Para imprenta, convertir el texto a curvas antes de entregar el arte final.
- Mantener una zona libre equivalente al ancho de un trazo alrededor del símbolo.
- Tamaño de interfaz recomendado: símbolo de 48 a 64 píxeles; no reducir el nombre por debajo de 24 píxeles.
- El icono de instalación usa únicamente el símbolo, centrado sobre blanco y dentro de la zona segura de recorte.
- No deformar, girar, añadir sombras, colocar sobre fotografías ni usar el amarillo para escribir el nombre sobre blanco.

## Paleta

| Token                | Color     | Uso                                                          |
| -------------------- | --------- | ------------------------------------------------------------ |
| `--brand-green`      | `#14634F` | Marca, acción principal, enlaces y foco                      |
| `--brand-yellow`     | `#F4CC4C` | Optimismo, acentos y fondos breves con texto oscuro          |
| `--brand-coral`      | `#BF4439` | Detalle del encuentro y acentos cálidos                      |
| `--brand-ink`        | `#20352C` | Texto principal                                              |
| `--brand-muted`      | `#52635A` | Texto secundario legible, nunca texto deshabilitado simulado |
| `--brand-surface`    | `#FFFFFF` | Superficies de lectura                                       |
| `--brand-background` | `#F3F6F4` | Fondo de trabajo                                             |
| `--brand-border`     | `#64746D` | Límites visibles de controles y separaciones                 |

Los tokens viven en `front/src/styles.scss` y el tema Angular Material comparte los colores principales. No introducir colores aislados en cada pantalla.

El amarillo del símbolo es decorativo y no alcanza por sí solo el contraste necesario sobre blanco. Nunca se utiliza así para texto, contornos de controles ni información esencial. El coral decorativo no significa error automáticamente.

## Tipografía y lectura

**Atkinson Hyperlegible**, regular y negrita, está diseñada para facilitar la diferenciación entre caracteres. Se sirve localmente con licencia OFL; no depende de Google Fonts. No sustituye una evaluación con personas con baja visión.

- Texto general: 18 píxeles como punto de partida, nunca menos de 16 píxeles en futuras pantallas.
- Interlineado de lectura: 1,6; etiquetas y títulos cortos pueden usar un interlineado menor.
- Negrita para jerarquía, no párrafos enteros en mayúsculas ni cursiva extensa.
- Texto alineado a la izquierda; evitar texto justificado y bloques demasiado anchos.
- Tamaños en unidades relativas; permitir ampliación y salto de línea sin ocultar acciones.
- No reducir la letra para que una palabra quepa en un botón. Permitir varias líneas.

## Interfaz y colaboración

- Conservar Angular Material, HTML semántico y navegación predecible; no crear una portada promocional.
- Controles de al menos 48 por 48 píxeles cuando se incorporen; acción principal visible y acciones secundarias diferenciadas.
- Iconos de la biblioteca Material con nombre accesible y texto cuando la acción no resulte evidente. Servir los recursos localmente.
- Foco visible, enlace para saltar al contenido y navegación con teclado.
- Nada de animaciones decorativas, confeti, puntuaciones de ayuda o imágenes que exhiban situaciones de vulnerabilidad.
- Fotografía futura: trabajo cotidiano y colaboración con consentimiento, nunca usar personas atendidas como recurso emocional.
- Formularios: etiquetas persistentes, ejemplo de fecha cercano al campo y errores con una indicación concreta para corregirlos.
- El modo simplificado y el menú persistente pertenecen a los flujos funcionales futuros; esta aplicación de marca no los implementa.

## Aplicaciones futuras

| Área            | Dirección verbal y visual                                                                                             |
| --------------- | --------------------------------------------------------------------------------------------------------------------- |
| Inventario FEFO | Combinar color con texto: «Caducado», «Caduca en 7 días», «Caduca en 20 días». Identificar siempre fecha y ubicación. |
| Familias        | Lenguaje neutral, prioridad explicable y datos personales discretos; nunca reducir a una familia a un color.          |
| Entregas        | Nombre, fecha y confirmación textual; evitar mensajes que parezcan premios o juicios sobre las personas.              |
| Voluntariado    | «Paso 1 de 3», progreso visible y ayuda breve; temporizador sin presión visual permanente.                            |

Los umbrales FEFO siguen las especificaciones del producto: rojo hasta 7 días, amarillo entre 8 y 30 y verde por encima de 30. «Sin caducidad» solo se incorporará cuando el modelo lo permita; no está previsto en los CRUD 002 y 003. El estado se expresará también con texto e icono, nunca solo con color.

## Alcance aplicado

Se han actualizado cabecera, tema global, tipografía local, título, favicon, manifiesto e iconos PWA. No se han inventado pantallas de inventario, familias, entregas o formación; el área principal conserva el `router-outlet` existente. La especificación 003 sigue pendiente de implementación.

Los iconos PNG se regeneran con `npm --prefix front run brand:icons`, usando el símbolo vectorial y Playwright ya disponible en el proyecto.

## Validación pendiente

- Comprobar marcas registradas, dominios y posibles coincidencias en el contexto de uso del nombre aprobado.
- Probar comprensión, lectura, teclado y dispositivos reales con personas mayores y con distintas dificultades visuales.
- Contrastar la comprensión del nombre y de los textos con la organización que utilizará el producto.
- Revisar nuevamente contrastes y accesibilidad al incorporar controles y estados reales; el tema no certifica por sí solo WCAG 2.2 AA para toda la aplicación.
