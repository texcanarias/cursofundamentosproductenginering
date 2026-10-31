# language: es
Característica: CRUD de partidas de productos en el backend
  Para conocer la caducidad y la localización de los productos
  Como responsable del inventario
  Quiero gestionar partidas independientes de un mismo producto

  Antecedentes:
    Dado un backend con persistencia en ficheros CSV
    Y cada partida tiene un identificador único generado por el backend
    Y cada partida contiene nombre de producto, fecha de caducidad y ubicación
    Y la caducidad es una fecha de calendario sin hora en formato "AAAA-MM-DD"

  Escenario: Crear una partida
    Cuando envío POST a "/api/lotes" con los datos:
      | nombreProducto | caducidad  | ubicacion           |
      | Arroz          | 2027-03-15 | Almacén A, balda 2  |
    Entonces recibo el estado HTTP 201
    Y recibo la partida con su identificador y los datos enviados
    Y la partida queda guardada en CSV

  Escenario: Registrar varias caducidades y ubicaciones para un producto
    Dado que existe una partida de "Arroz" con caducidad "2027-03-15" en "Almacén A"
    Cuando creo otra partida de "Arroz" con caducidad "2027-06-20" en "Almacén B"
    Entonces ambas partidas tienen identificadores distintos
    Y consultar el inventario devuelve ambas partidas sin sobrescribir ninguna

  Escenario: Registrar partidas coincidentes
    Dado que existe una partida de "Arroz" con caducidad "2027-03-15" en "Almacén A"
    Cuando creo otra partida con el mismo nombre, caducidad y ubicación
    Entonces se crea una partida independiente con un identificador distinto

  Escenario: Consultar todas las partidas
    Dado que existen varias partidas guardadas
    Cuando envío GET a "/api/lotes"
    Entonces recibo el estado HTTP 200
    Y recibo una lista con el identificador, nombre, caducidad y ubicación de cada partida

  Escenario: Consultar un inventario vacío
    Dado que no existen partidas guardadas
    Cuando envío GET a "/api/lotes"
    Entonces recibo el estado HTTP 200
    Y recibo una lista vacía

  Escenario: Consultar una partida por identificador
    Dado que existe una partida guardada
    Cuando envío GET a "/api/lotes/{id}" con su identificador
    Entonces recibo el estado HTTP 200
    Y recibo únicamente la partida solicitada

  Escenario: Modificar una partida sin alterar las demás
    Dado que existen dos partidas del mismo producto
    Cuando envío PUT a "/api/lotes/{id}" para una de ellas con los datos:
      | nombreProducto | caducidad  | ubicacion           |
      | Arroz integral | 2027-07-01 | Almacén C, balda 1  |
    Entonces recibo el estado HTTP 200 con la partida actualizada
    Y se conserva su identificador
    Y los cambios quedan guardados en CSV
    Y la otra partida permanece sin cambios

  Escenario: Eliminar una partida sin eliminar las demás
    Dado que existen dos partidas del mismo producto
    Cuando envío DELETE a "/api/lotes/{id}" para una de ellas
    Entonces recibo el estado HTTP 204 sin cuerpo
    Y la partida eliminada deja de aparecer en las consultas y en el CSV
    Y la otra partida permanece sin cambios

  Esquema del escenario: Rechazar datos no válidos al crear o modificar
    Cuando intento crear o modificar una partida con "<defecto>"
    Entonces recibo el estado HTTP 400
    Y recibo un error JSON que identifica el campo y el motivo
    Y no se altera ninguna partida guardada

    Ejemplos:
      | defecto                                      |
      | nombreProducto ausente, vacío o solo espacios |
      | ubicacion ausente, vacía o solo espacios      |
      | caducidad ausente o vacía                    |
      | caducidad con formato 15/03/2027              |
      | caducidad imposible como 2027-02-30           |
      | caducidad con hora o zona horaria            |
      | un campo obligatorio con tipo distinto de texto |

  Escenario: Conservar productos ya caducados
    Cuando creo o modifico una partida con una fecha de caducidad pasada válida
    Entonces la operación se acepta
    Y la partida puede consultarse sin que se cambie su fecha

  Esquema del escenario: Operar sobre una partida inexistente
    Cuando envío <metodo> a "/api/lotes/{id}" con un identificador inexistente
    Y el cuerpo es válido si la operación requiere datos
    Entonces recibo el estado HTTP 404 con un error JSON
    Y no se altera el inventario

    Ejemplos:
      | metodo |
      | GET    |
      | PUT    |
      | DELETE |

  Escenario: Recuperar el inventario tras reiniciar el backend
    Dado que he creado, modificado y eliminado partidas correctamente
    Cuando reinicio el backend y consulto "/api/lotes"
    Entonces obtengo el estado persistido del inventario
    Y se conservan los identificadores de las partidas existentes

  Escenario: Conservar caracteres especiales mediante CSV
    Cuando guardo una partida con nombre "Arroz, integral" y ubicación 'Estante "A", sección 2'
    Y vuelvo a consultar la partida tras reiniciar el backend
    Entonces recupero exactamente el nombre y la ubicación guardados

  Escenario: Informar de un fallo de persistencia
    Dado que el almacenamiento CSV no permite guardar cambios
    Cuando intento crear, modificar o eliminar una partida válida
    Entonces recibo el estado HTTP 500 con un error JSON
    Y no recibo una confirmación de éxito