---
name: diseno-marca-aplicacion
description: "Diseña, documenta o aplica la identidad de marca de esta aplicación de gestión solidaria. Úsalo para branding, nombre, tono de voz, logotipo, paleta, tipografía, iconos, PWA o coherencia visual de inventario, familias y voluntariado."
argument-hint: "Indica qué necesitas definir o aplicar: identidad completa, una pieza de marca o una pantalla."
---

# Identidad de marca de la aplicación

## Objetivo

Crear una identidad reconocible, digna y práctica para una aplicación que ayuda a organizaciones comunitarias a gestionar alimentos, atender a familias y orientar a voluntariado. La marca debe transmitir confianza y colaboración sin estigmatizar a las personas ni convertir la ayuda en espectáculo.

## Cuándo usarlo

- Definir o revisar nombre, posicionamiento, personalidad, voz o mensajes.
- Diseñar o implementar logotipo, colores, tipografía, iconografía, ilustración o recursos PWA.
- Aplicar la identidad a una pantalla, componente, documento o material de comunicación.
- Revisar si una propuesta visual es consistente, accesible y adecuada para sus usuarios.

## Procedimiento

1. **Delimita el encargo.** Determina si se solicita estrategia de marca, un sistema visual/verbal, un activo concreto o su implementación. Si no se indica alcance, propone un sistema verbal y visual y aplícalo a la interfaz existente en el ámbito necesario, sin inventar flujos de producto. Revisa las especificaciones y la interfaz relacionada antes de proponer cambios.
2. **Identifica lo confirmado y lo desconocido.** Considera los flujos de inventario FEFO, registro y prioridad de familias, entregas e inducción de voluntariado; la experiencia debe ser mobile-first, accesible, sencilla y usable durante tareas operativas. No des por decidido el nombre, territorio, organización, audiencia secundaria ni personalidad si el repositorio o el usuario no lo confirman. No infieras una región o cultura por el idioma; valida los matices locales cuando afecten a nombres, lenguaje o símbolos.
3. **Pregunta solo lo que cambie sustancialmente la dirección.** Si faltan nombre o contexto local para un entregable final, plantea hasta tres preguntas breves. Si el usuario quiere avanzar ya, presenta una dirección provisional y marca explícitamente las decisiones por validar.
4. **Define una dirección con intención.** Expón en pocas líneas propósito, audiencia, promesa, atributos de personalidad y diferenciación. Propón una idea visual y verbal coherente con la operación comunitaria; evita clichés de caridad, urgencia permanente, infantilización y estereotipos sobre pobreza o alimentación.
5. **Construye el sistema necesario.** Según el alcance, concreta nombre y criterios de naming, tono con ejemplos, paleta con valores, tipografías, usos del logotipo, iconografía, fotografía/ilustración y reglas para interfaces. Distingue decisiones aprobadas de propuestas.
6. **Aterriza la identidad en el producto.** Respeta las convenciones existentes. Para el frontend, conserva Angular Material, estructura semántica y enfoque mobile-first; define tokens reutilizables y aplícalos en los archivos dueños de los estilos. No rehagas pantallas o arquitectura fuera del alcance pedido.
7. **Verifica legibilidad y accesibilidad.** Comprueba contraste de texto y controles con WCAG 2.2 AA cuando sea aplicable; no comuniques caducidad, prioridad, errores o éxito solo mediante color. Combina color con texto, iconos o forma. Mantén controles táctiles claros, texto legible, foco visible, estados distinguibles y contenido comprensible con lector de pantalla.
8. **Cierra con un sistema utilizable.** Resume las decisiones, entrega los activos o cambios solicitados y señala qué queda provisional. Si se implementó en el frontend, ejecuta las comprobaciones pertinentes de lint, pruebas y compilación disponibles; informa con precisión de cualquier validación pendiente.

## Criterios de calidad

- La propuesta responde a necesidades reales de familias, personal y voluntariado, sin asumir que todos comparten conocimientos o capacidades.
- La identidad es consistente entre interfaz, mensajes, iconos y recursos de instalación; no depende de un logotipo aislado.
- Los estados operativos siguen siendo fáciles de distinguir en móvil, con poca atención disponible y sin depender exclusivamente del color.
- Los colores, tipografías y componentes forman un sistema mantenible, no una colección de estilos puntuales.
- Las decisiones no confirmadas se presentan como hipótesis; no se atribuyen valores, historia ni representación a una comunidad sin evidencia.
- La marca no reduce la dignidad de sus usuarios ni promete capacidades que el producto no ofrece.

## Entrega sugerida

Para una identidad completa: breve de marca, dirección propuesta, sistema verbal y visual, ejemplos aplicados a los flujos principales, decisiones pendientes y verificaciones de accesibilidad. Para un encargo acotado, entrega únicamente lo necesario y explica cómo encaja en el sistema existente.