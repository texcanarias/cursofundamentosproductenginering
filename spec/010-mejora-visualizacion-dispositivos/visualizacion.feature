# language: es
Característica: Visualización de datos en dispositivos móviles y tablets
  Para consultar el inventario y las entregas con comodidad en cualquier dispositivo
  Como persona voluntaria que usa la aplicación desde el móvil o la tablet
  Quiero que los datos se lean completos y las acciones sean fáciles de pulsar

  Antecedentes:
    Dado que utilizo la aplicación "A la par" con Angular Material
    Y el inventario y las entregas se muestran como tarjetas accesibles

  @movil @inventario
  Escenario: Ver el inventario completo en un móvil pequeño
    Dado que hay partidas con nombres y ubicaciones largas
    Y abro el inventario en una pantalla de 320 píxeles de ancho
    Entonces veo cada partida en una sola columna
    Y el nombre, la caducidad y la ubicación se muestran completos
    Y no aparece desplazamiento horizontal en la página

  @movil @entregas
  Escenario: Ver las entregas completas en un móvil pequeño
    Dado que hay entregas con observaciones largas
    Y abro las entregas en una pantalla de 320 píxeles de ancho
    Entonces veo cada entrega en una sola columna
    Y el identificador de familia, la fecha y la observación se muestran completos
    Y no aparece desplazamiento horizontal en la página

  @tablet @inventario
  Escenario: Aprovechar el espacio de una tablet
    Dado que abro el inventario en una pantalla de 768 píxeles de ancho
    Entonces las partidas se distribuyen en dos columnas legibles
    Y cada tarjeta conserva su nombre, caducidad, ubicación y acciones

  @tablet @entregas
  Escenario: Aprovechar el espacio de una tablet en las entregas
    Dado que abro las entregas en una pantalla de 768 píxeles de ancho
    Entonces las entregas se distribuyen en dos columnas legibles
    Y cada tarjeta conserva su identificador, fecha, observación y acciones

  @escritorio
  Escenario: Limitar la anchura de lectura en pantallas grandes
    Dado que abro el inventario en una pantalla de 1440 píxeles de ancho
    Entonces el contenido se mantiene centrado con un ancho máximo de lectura
    Y las partidas no se estiran hasta los bordes de la ventana

  @accesibilidad @inventario
  Escenario: Distinguir la caducidad sin depender del color
    Dado que hay una partida que caduca en 7 días
    Cuando consulto el inventario
    Entonces veo el estado de caducidad escrito con texto
    Y el color no es la única forma de entender el estado

  @accesibilidad
  Escenario: Pulsar las acciones con comodidad en un móvil
    Dado que abro el inventario en un móvil
    Entonces cada botón de ver, editar y eliminar mide al menos 48 por 48 píxeles
    Y los botones tienen una separación que evita pulsaciones accidentales
    Y cada botón tiene un nombre accesible

  @accesibilidad
  Escenario: Ampliar el texto sin perder información
    Dado que amplío el texto al 200 por ciento
    Cuando consulto el inventario o las entregas
    Entonces todo el texto se lee sin cortarse
    Y todas las acciones siguen visibles y utilizables
    Y no aparece desplazamiento horizontal en la página

  @accesibilidad
  Escenario: Usar la aplicación con el teclado
    Dado que navego con el teclado por el inventario
    Cuando recorro las tarjetas y sus acciones
    Entonces el orden del foco coincide con el orden visual
    Y el foco se ve claramente en cada control
    Y puedo llegar al contenido con el enlace de salto

  @orientacion
  Escenario: Cambiar la orientación del dispositivo
    Dado que consulto el inventario en un móvil en vertical
    Cuando giro el dispositivo a horizontal
    Entonces la información sigue completa y ordenada
    Y no se pierde el foco ni el contenido visible

  @movil @cabecera
  Escenario: Mantener la marca y la navegación en pantallas estrechas
    Dado que abro la aplicación en un móvil
    Entonces veo el nombre "A la par" y su descriptor sin recortes
    Y puedo acceder a Inventario y Entregas sin desplazamiento horizontal
    Y la cabecera no tapa el contenido

  @movil @formularios
  Escenario: Rellenar un formulario en el móvil
    Dado que abro el formulario de añadir producto en un móvil
    Entonces cada campo ocupa el ancho disponible y su etiqueta se lee completa
    Y las acciones de guardar y cancelar se apilan sin salir de la pantalla
    Y todas las acciones se pueden pulsar con una sola mano

  @movil @estados
  Escenario: Leer los estados vacíos y de error en pantallas pequeñas
    Dado que abro el inventario vacío en un móvil
    Cuando no hay partidas o se produce un error de lectura
    Entonces el mensaje se muestra completo y con un ancho legible
    Y la acción de reintentar o de añadir producto sigue visible

  @regresion
  Escenario: Mantener los flujos existentes
    Dado que la visualización se ha adaptado a los dispositivos
    Cuando consulto, creo, edito y elimino partidas y entregas
    Entonces los flujos y la persistencia en el navegador siguen funcionando igual
    Y las pruebas de las especificaciones 003, 004, 006 y 009 siguen pasando
