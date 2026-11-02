# language: es
Característica: Persistencia de datos en el navegador
  Para conservar el inventario y las entregas sin depender de un servidor
  Como persona voluntaria que usa la aplicación en distintos momentos
  Quiero que los datos permanezcan guardados en este navegador

  Antecedentes:
    Dado que utilizo el frontend Angular con Angular Material
    Y el frontend guarda las partidas en el almacenamiento local del navegador
    Y el frontend guarda las entregas en el almacenamiento local del navegador

  @inventario
  Escenario: Conservar las partidas al recargar la página
    Cuando creo una partida desde la interfaz
    Y recargo la página
    Entonces la partida sigue disponible en el inventario

  @entregas
  Escenario: Conservar las entregas al recargar la página
    Cuando registro una entrega desde la interfaz
    Y recargo la página
    Entonces la entrega sigue disponible en el listado

  @inventario
  Escenario: Mantener separados el inventario y las entregas
    Cuando guardo una partida y una entrega
    Entonces cada una se guarda bajo su propia clave
    Y las operaciones de inventario no alteran las entregas

  @inventario
  Escenario: No confirmar una escritura fallida
    Dado que hay una partida guardada en el navegador
    Y que el navegador rechaza nuevas escrituras
    Cuando intento crear otra partida
    Entonces veo un mensaje accesible con el motivo disponible
    Y la partida anterior permanece intacta
