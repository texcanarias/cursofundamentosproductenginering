# language: es
Característica: Registro de entregas de ayuda alimentaria a familias (backend)
  Para llevar el control de qué familias han recibido ayuda y cuándo
  Como persona voluntaria responsable del padrón
  Quiero registrar entregas de ayuda alimentaria a una familia en una fecha concreta

  Antecedentes:
    Dado que el backend expone el contrato de "/api/entregas"
    Y cada entrega tiene un identificador de familia, una fecha y una observación opcional

  Escenario: Registrar una entrega a una familia
    Cuando envío una petición POST a "/api/entregas" con identificador de familia "FAM-001" y fecha "2026-10-31"
    Entonces la respuesta contiene el identificador de la entrega, el identificador de familia "FAM-001" y la fecha "2026-10-31"
    Y la fecha se devuelve exactamente como "2026-10-31"

  Escenario: Registrar una entrega con observación opcional
    Cuando envío una petición POST a "/api/entregas" con identificador de familia "FAM-002", fecha "2026-10-31" y observación "Entrega completa"
    Entonces la respuesta contiene la observación "Entrega completa"

  Escenario: Consultar todas las entregas registradas
    Dado que existen entregas registradas en el backend
    Cuando consulto el listado mediante GET "/api/entregas"
    Entonces recibo un array con todas las entregas
    Y cada entrega tiene identificador, identificador de familia, fecha y observación

  Escenario: Consultar una entrega por su identificador
    Dado que existe una entrega con identificador "ENT-001"
    Cuando consulto la entrega mediante GET "/api/entregas/ENT-001"
    Entonces recibo los datos completos de esa entrega

  Escenario: Eliminar una entrega
    Dado que existe una entrega con identificador "ENT-001"
    Cuando elimino la entrega mediante DELETE "/api/entregas/ENT-001"
    Entonces la respuesta no tiene cuerpo
    Y la entrega ya no aparece en el listado

  Escenario: Rechazar entrega sin identificador de familia
    Cuando envío una petición POST a "/api/entregas" sin identificador de familia
    Entonces se rechaza con un error de validación que indica el campo "familiaId"
    Y no se crea ninguna entrega

  Escenario: Rechazar entrega sin fecha
    Cuando envío una petición POST a "/api/entregas" sin fecha
    Entonces se rechaza con un error de validación que indica el campo "fecha"
    Y no se crea ninguna entrega

  Escenario: Rechazar fecha con formato inválido
    Cuando envío una petición POST a "/api/entregas" con fecha "31-10-2026" o "2026-13-01"
    Entonces se rechaza con un error de validación que indica el campo "fecha"
    Y no se crea ninguna entrega

  Escenario: Registrar entrega con fecha pasada
    Cuando envío una petición POST a "/api/entregas" con fecha pasada válida "2026-01-15"
    Entonces se acepta la entrega
    Y la fecha se guarda exactamente como "2026-01-15"

  Escenario: Operar sobre una entrega inexistente
    Cuando consulto o elimino una entrega con identificador que no existe
    Entonces recibo un error HTTP 404
    Y se informa de que la entrega no está disponible

  Escenario: Mantener entregas tras reiniciar el servidor
    Dado que se ha registrado una entrega
    Cuando el servidor se reinicia
    Entonces la entrega sigue disponible en el listado

  Escenario: Conservar caracteres especiales en identificador de familia
    Cuando registro una entrega con identificador de familia "FAM-ÁÉÍÓÚ/&"
    Entonces el identificador se conserva exactamente en la respuesta y en el CSV
