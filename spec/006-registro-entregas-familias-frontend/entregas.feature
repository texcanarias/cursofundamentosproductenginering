# language: es
Característica: CRUD visual de entregas de ayuda alimentaria a familias (frontend)
  Para consultar y registrar entregas de ayuda desde una interfaz accesible
  Como persona voluntaria responsable del padrón
  Quiero crear, consultar y eliminar entregas de ayuda alimentaria a familias

  Antecedentes:
    Dado que utilizo el frontend Angular con Angular Material
    Y el frontend guarda las entregas en el almacenamiento local del navegador
    Y cada entrega tiene identificador de familia, fecha y observación opcional

  Escenario: Consultar las entregas guardadas
    Dado que el navegador contiene varias entregas
    Cuando accedo a la vista de entregas
    Entonces veo el identificador de familia, la fecha y la observación de cada entrega
    Y cada entrega dispone de acciones para consultar su detalle y eliminarla

  Escenario: Distinguir varias entregas de una misma familia
    Dado que existen dos entregas para la familia "FAM-001" con distintas fechas
    Cuando accedo a la vista de entregas
    Entonces veo ambas entregas por separado con sus propios datos
    Y las acciones de cada entrega utilizan su identificador, no el identificador de familia

  Escenario: Mostrar un listado vacío
    Dado que no hay entregas guardadas en el navegador
    Cuando accedo a la vista de entregas
    Entonces veo un estado de listado sin entregas
    Y puedo iniciar el alta de una entrega

  Escenario: Crear una entrega
    Cuando inicio el alta de una entrega
    Y completo identificador de familia, fecha y observación con valores válidos
    Y confirmo el guardado
    Entonces la entrega se guarda en el almacenamiento del navegador
    Y tras confirmarse el éxito veo la nueva entrega en el listado
    Y recibo una confirmación accesible del guardado

  Escenario: Consultar el detalle de una entrega
    Dado que veo una entrega en el listado
    Cuando abro su detalle
    Entonces se recupera la entrega por su identificador desde el navegador
    Y veo su identificador de familia, fecha y observación completos
    Y puedo regresar al listado

  Escenario: Cancelar un formulario sin guardar
    Dado que he introducido cambios en el formulario de alta
    Cuando cancelo la operación
    Entonces regreso al listado sin modificar el almacenamiento
    Y las entregas guardadas permanecen sin cambios

  Escenario: Validar el formulario
    Cuando intento guardar con identificador de familia vacío o solo espacios, o con fecha ausente o inválida
    Entonces veo los errores asociados a los campos afectados
    Y los errores pueden ser anunciados por un lector de pantalla
    Y no se modifica el almacenamiento

  Escenario: Admitir fechas pasadas sin desplazarlas por zona horaria
    Cuando registro una entrega con una fecha de entrega pasada válida
    Entonces el formulario permite guardarla
    Y la fecha se guarda como "AAAA-MM-DD" sin hora ni zona horaria
    Y al volver a consultarla veo el mismo día seleccionado

  Escenario: Confirmar la eliminación de una entrega
    Dado que existen entregas en el listado
    Cuando solicito eliminar una de ellas
    Entonces aparece una confirmación que identifica su identificador de familia, fecha y observación
    Cuando confirmo la eliminación
    Entonces se elimina solo esa entrega del almacenamiento del navegador
    Y solo desaparece del listado tras confirmarse el éxito

  Escenario: Cancelar la eliminación
    Dado que he abierto la confirmación de eliminación de una entrega
    Cuando cancelo la eliminación
    Entonces el almacenamiento no cambia
    Y la entrega permanece visible
    Y el foco regresa al control que abrió la confirmación

  Escenario: Recuperarse de un error al consultar
    Dado que los datos guardados en el navegador no se pueden leer
    Cuando accedo a la vista de entregas
    Entonces veo un mensaje de error accesible y una acción para reintentar
    Y el error no se presenta como un listado vacío

  Escenario: Recuperarse de un error al guardar o eliminar
    Dado que el navegador rechaza nuevas escrituras
    Cuando intento guardar o eliminar una entrega
    Entonces veo un mensaje accesible con el motivo disponible
    Y no se presenta la operación como completada
    Y se conservan los valores del formulario si estaba creando
    Y puedo corregir los datos o reintentar cuando proceda

  Escenario: Informar de una entrega que ya no existe
    Dado que una entrega visible se ha eliminado en otra pestaña
    Cuando intento consultar o eliminar esa entrega
    Entonces se informa de que la entrega ya no está disponible
    Y puedo volver al listado actualizado

  Escenario: Utilizar el listado desde móvil y con tecnologías de apoyo
    Cuando recorro el listado, los formularios y las confirmaciones
    Entonces puedo completar el CRUD usando únicamente el teclado
    Y los campos tienen etiquetas y los controles tienen nombres accesibles
    Y el foco es visible y se gestiona al abrir y cerrar las confirmaciones
    Y los botones tienen un área interactiva de al menos 48 por 48 píxeles CSS
    Y el texto tiene un tamaño mínimo de 16 píxeles CSS
    Y en una pantalla de 320 píxeles CSS de ancho no se ocultan datos ni acciones ni se exige desplazamiento horizontal
