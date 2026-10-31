# language: es
Característica: Identidad alegre y legible de A la par
  Para trabajar en equipo con una identidad clara y acogedora
  Como persona voluntaria, también si tengo poca experiencia digital o dificultades visuales
  Quiero reconocer la aplicación y leerla sin esfuerzo innecesario

  Antecedentes:
    Dado el frontend está disponible
    Cuando abro la página principal

  Escenario: Reconocer la marca y utilizar tipografía local
    Entonces reconozco A la par en la cabecera y el título de la página
    Y la tipografía de lectura se carga desde la propia aplicación

  Esquema del escenario: Conservar la legibilidad en móvil y escritorio
    Cuando uso una pantalla de <ancho> píxeles de ancho
    Entonces la cabecera no exige desplazamiento horizontal y el texto mide al menos 18 píxeles

    Ejemplos:
      | ancho |
      | 320   |
      | 1280  |

  Escenario: Aumentar el texto en móvil
    Cuando uso una pantalla de 320 píxeles de ancho
    Y amplío el texto al doble
    Entonces la cabecera no exige desplazamiento horizontal y el texto mide al menos 18 píxeles

  Escenario: Llegar al contenido mediante teclado
    Cuando salto al contenido utilizando el teclado
    Entonces el foco está en la región principal

  Escenario: Distinguir textos y límites sin depender de un amarillo poco contrastado
    Entonces la paleta cumple estos contrastes mínimos
      | texto          | fondo              | minimo |
      | --brand-ink    | --brand-surface    | 4.5    |
      | --brand-green  | --brand-surface    | 4.5    |
      | --brand-muted  | --brand-surface    | 4.5    |
      | --brand-ink    | --brand-yellow     | 4.5    |
      | --brand-coral  | --brand-surface    | 4.5    |
      | --brand-border | --brand-surface    | 3      |
      | --brand-green  | --brand-background | 3      |

  Escenario: Instalar una aplicación con marca coherente
    Entonces el manifiesto y los iconos instalables usan la identidad A la par