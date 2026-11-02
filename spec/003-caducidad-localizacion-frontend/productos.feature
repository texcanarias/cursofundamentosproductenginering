# language: es
Característica: CRUD visual de partidas de productos
  Para consultar dónde están los productos y cuándo caducan
  Como persona voluntaria responsable del inventario
  Quiero crear, consultar, modificar y eliminar partidas desde una interfaz accesible

  Antecedentes:
    Dado que utilizo el frontend Angular con Angular Material
    Y el frontend guarda las partidas en el almacenamiento local del navegador
    Y cada partida tiene nombre de producto, caducidad y ubicación

  Escenario: Consultar las partidas guardadas
    Dado que el navegador contiene varias partidas
    Cuando accedo a la vista de inventario
    Entonces veo el nombre del producto, la caducidad y la ubicación de cada partida
    Y cada partida dispone de acciones para consultar su detalle, editarla y eliminarla

  Escenario: Distinguir varias partidas de un mismo producto
    Dado que existen dos partidas de "Arroz" con distintas caducidades y ubicaciones
    Cuando accedo a la vista de inventario
    Entonces veo ambas partidas por separado con sus propios datos
    Y las acciones de cada partida utilizan su identificador, no el nombre del producto

  Escenario: Mostrar un inventario vacío
    Dado que no hay partidas guardadas en el navegador
    Cuando accedo a la vista de inventario
    Entonces veo un estado de inventario sin productos
    Y puedo iniciar el alta de una partida

  Escenario: Crear una partida
    Cuando inicio el alta de una partida
    Y completo nombre de producto, caducidad y ubicación con valores válidos
    Y confirmo el guardado
    Entonces la partida se guarda en el almacenamiento del navegador
    Y tras confirmarse el éxito veo la nueva partida en el inventario
    Y recibo una confirmación accesible del guardado

  Escenario: Consultar el detalle de una partida
    Dado que veo una partida en el inventario
    Cuando abro su detalle
    Entonces se recupera la partida por su identificador desde el navegador
    Y veo su nombre, caducidad y ubicación completos
    Y puedo regresar al inventario

  Escenario: Editar una partida
    Dado que existen dos partidas del mismo producto
    Cuando abro la edición de una de ellas
    Entonces el formulario contiene sus valores actuales
    Cuando cambio el nombre, la caducidad o la ubicación y guardo
    Entonces se actualiza solo esa partida en el almacenamiento del navegador
    Y tras confirmarse el éxito veo los datos actualizados
    Y la otra partida permanece sin cambios

  Escenario: Cancelar un formulario sin guardar
    Dado que he introducido cambios en el formulario de alta o edición
    Cuando cancelo la operación
    Entonces regreso al inventario sin modificar el almacenamiento
    Y las partidas guardadas permanecen sin cambios

  Escenario: Validar el formulario
    Cuando intento guardar con nombre o ubicación vacíos o solo espacios, o con caducidad ausente o inválida
    Entonces veo los errores asociados a los campos afectados
    Y los errores pueden ser anunciados por un lector de pantalla
    Y no se modifica el almacenamiento

  Escenario: Admitir fechas pasadas sin desplazarlas por zona horaria
    Cuando registro una partida con una fecha de caducidad pasada válida
    Entonces el formulario permite guardarla
    Y la fecha se guarda como "AAAA-MM-DD" sin hora ni zona horaria
    Y al volver a consultarla veo el mismo día seleccionado

  Escenario: Confirmar la eliminación de una partida
    Dado que existen dos partidas del mismo producto
    Cuando solicito eliminar una de ellas
    Entonces aparece una confirmación que identifica su nombre, caducidad y ubicación
    Cuando confirmo la eliminación
    Entonces se elimina solo esa partida del almacenamiento del navegador
    Y solo desaparece del inventario tras confirmarse el éxito
    Y la otra partida permanece visible y sin cambios

  Escenario: Cancelar la eliminación
    Dado que he abierto la confirmación de eliminación de una partida
    Cuando cancelo la eliminación
    Entonces el almacenamiento no cambia
    Y la partida permanece visible
    Y el foco regresa al control que abrió la confirmación

  Escenario: Recuperarse de un error al consultar
    Dado que los datos guardados en el navegador no se pueden leer
    Cuando accedo a la vista de inventario
    Entonces veo un mensaje de error accesible y una acción para reintentar
    Y el error no se presenta como un inventario vacío

  Escenario: Recuperarse de un error al guardar o eliminar
    Dado que el navegador rechaza nuevas escrituras
    Cuando intento crear, editar o eliminar una partida
    Entonces veo un mensaje accesible con el motivo disponible
    Y no se presenta la operación como completada
    Y se conservan los valores del formulario si estaba creando o editando
    Y puedo corregir los datos o reintentar cuando proceda

  Escenario: Informar de una partida que ya no existe
    Dado que una partida visible se ha eliminado en otra pestaña
    Cuando intento consultar, editar o eliminar esa partida
    Entonces se informa de que la partida ya no está disponible
    Y puedo volver al inventario actualizado

  Escenario: Utilizar el inventario desde móvil y con tecnologías de apoyo
    Cuando recorro el inventario, los formularios y las confirmaciones
    Entonces puedo completar el CRUD usando únicamente el teclado
    Y los campos tienen etiquetas y los controles tienen nombres accesibles
    Y el foco es visible y se gestiona al abrir y cerrar las confirmaciones
    Y los botones tienen un área interactiva de al menos 44 por 44 píxeles CSS
    Y el texto tiene un tamaño mínimo de 16 píxeles CSS
    Y en una pantalla de 320 píxeles CSS de ancho no se ocultan datos ni acciones ni se exige desplazamiento horizontal
