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
- Angular 22
- Angular Material para los componentes

## Guias de estilo

- No superar las 20 lineas por metodo
- Usar aprox 200 lineas por fichero
- Prettier
- ESlint
- Buenas prácticas

## Estructura

| Tecnología | Ruta    |
| ---------- | ------- |
| Docker     | docker/ |
| front      | front/  |
| back       | back/   |

## La solución será

La aplicación incluirá:

    Interfaz accesible: Botones grandes, texto legible (+16px), modo de vista simplificada con menú persistente.

    Inventario FEFO: Clasificación colorimétrica (🔴 7 días, 🟡 8-30 días, 🟢 +30 días/No perecederos) con asistente guiado para la Regla de las 3 Cajas.

    Registro de Familias: Padrón digital visual, cálculo automático de prioridad (vulnerabilidad vs turno rotativo 15 días), registro rápido de entrega y generador de mensajes de WhatsApp.

    Inducción Exprés: Checklist interactivo en 3 pasos con temporizador visual para capacitar a voluntarios en menos de 5 minutos.
