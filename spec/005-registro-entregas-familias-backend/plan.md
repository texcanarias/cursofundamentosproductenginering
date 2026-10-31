# Plan: Registro de entregas de ayuda alimentaria a familias (backend)

Estado: especificación aceptada por el usuario el 2026-10-31. Implementación no iniciada.

## Alcance y dependencias

- Depende del entorno de desarrollo (especificación 001) ya completado.
- No depende del frontend; es exclusivamente backend.
- Queda fuera el cálculo de prioridad, turno rotativo, cantidades, tipos de ayuda y autenticación.

## Implementación prevista

1. Revisión y aprobación de esta especificación y su contrato HTTP.
2. Modelar la entrega y sus validaciones en el dominio, siguiendo DDD y TypeScript.
3. Definir los casos de uso CRUD y el puerto de repositorio en aplicación.
4. Implementar el repositorio mediante el adaptador CSV existente, conservando identificadores y caracteres especiales.
5. Exponer el contrato HTTP y traducir errores de validación, ausencia y persistencia.
6. Añadir pruebas unitarias del dominio y los casos de uso.
7. Añadir pruebas de integración HTTP y CSV, incluyendo reinicio y aislamiento entre entregas.
8. Verificar los escenarios Gherkin, lint, formato y compilación tras autorizar la implementación.

## Criterio de aceptación

Todos los escenarios de `entregas.feature` deben quedar cubiertos por pruebas automatizadas. Mantener métodos de hasta 20 líneas y ficheros de aproximadamente 200 líneas, conforme a las instrucciones del repositorio.
