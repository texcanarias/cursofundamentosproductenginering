# Seguimiento: Identidad de marca A la par

Estado: identidad aprobada por el usuario, aplicada y verificada el 2026-10-31. Referencia obligatoria para el frontend; pendientes las comprobaciones legales y la validación con personas usuarias.

- [x] Revisar la interfaz y el alcance de las especificaciones existentes.
- [x] Proponer nombre, símbolo, tono, paleta y reglas de lectura.
- [x] Aplicar tema Material y cabecera sin inventar flujos de producto.
- [x] Incorporar fuentes locales con licencia e iconos PWA reproducibles.
- [x] Redactar escenarios Gherkin y pruebas unitarias.
- [x] Ejecutar pruebas de integración de marca, lint, formato y compilación finales.
- [x] Revisar capturas de escritorio y móvil.
- [x] Aprobar nombre, símbolo y sistema visual y verbal con el usuario el 2026-10-31.
- [x] Registrar en AGENTS.md la aplicación obligatoria de la especificación 004 a todas las implementaciones del frontend.
- [ ] Comprobar disponibilidad legal del nombre.
- [ ] Validar comprensión y accesibilidad con personas usuarias y organización.

La especificación 004 queda aprobada expresamente y debe aplicarse también a la implementación futura de la 003. El alcance visual no incorpora la funcionalidad pendiente de esa especificación.

## Verificación realizada

- `npm --prefix front run brand:icons`: PNG generados a partir del símbolo y revisado visualmente el icono de 512 píxeles.
- `npm --prefix front run test:gherkin`: 8 escenarios y 46 pasos correctos, incluyendo el escenario existente del entorno.
- `npm --prefix front test`: 3 pruebas unitarias correctas.
- `npm --prefix front run lint`: correcto.
- `npm --prefix front run format:check`: correcto.
- `npm --prefix front run build`: correcto, incluidos los recursos PWA y las fuentes locales.
- Sin diagnósticos del editor en los archivos revisados.
- Capturas revisadas a 1280 × 800 y 320 × 740 píxeles: símbolo visible, tipografía local y cabecera sin desbordamientos.
- Ampliación del texto al 200 % sobre el tamaño base comprobada a 320 píxeles mediante Playwright.
- Contrastes de las parejas definidas en `marca.feature` comprobados con la fórmula de luminancia relativa WCAG; no equivalen a una certificación global de accesibilidad.

El ejecutor Gherkin del frontend selecciona los escenarios implementados de las especificaciones 001 y 004. Los escenarios del backend 002 se cubren con su suite Vitest y la 003 sigue pendiente; no se consideran verificados por esta suite.

Vista local de la aplicación: `http://127.0.0.1:4301/`. La pantalla conserva el área principal vacía hasta que se implementen sus rutas funcionales. No se han realizado commits ni modificado el backend en este encargo.
