# Proyecto de Hotel

Este proyecto consiste en una plataforma web modular diseñada para la gestión y visualización de datos relacionados con un hotel. Incluye una estructura organizada, integración con bases de datos, consumo de APIs y manejo de funcionalidades utilizando diferentes métodos HTTP. A continuación, se detalla cada aspecto del proyecto.

## Estructura del Proyecto

El proyecto está organizado de manera modular, con las siguientes carpetas principales:

- _css/_: Contiene los estilos utilizados en el sitio web para darle un diseño atractivo y profesional.
- _data-base/_: Incluye los archivos necesarios para la configuración de la base de datos. Esta base de datos ha sido implementada en un servidor gratuito de Render y está accesible a través de una GitHub Page para facilitar su funcionamiento.
- _img/_: Almacena todas las imágenes utilizadas en el sitio web, como logotipos, imágenes de habitaciones, y otros recursos visuales.
- _js/_: Contiene los scripts de JavaScript que implementan la lógica de la plataforma, incluyendo el consumo de APIs y la manipulación dinámica del DOM.
- _pages/_: Incluye las páginas adicionales del sitio web, como "Acerca de", "Servicios", "Contacto", entre otras.
- _videos/_: Contiene videos promocionales o instructivos relacionados con el hotel.
- _index.html_: Archivo principal que actúa como punto de entrada al sitio web.

## Base de Datos

La base de datos del proyecto está implementada en un servidor gratuito de Render, lo que permite:

1. _Acceso Centralizado_: Los datos están disponibles en línea para su consulta y gestión.
2. _Actualizaciones Dinámicas_: A través de la integración con la plataforma, los datos se actualizan automáticamente con los cambios realizados desde la interfaz web.

## Funcionalidades Implementadas

El proyecto incluye diversas funcionalidades para asegurar una experiencia completa y eficiente:

### Registro e Inicio de Sesión

El sistema permite a los usuarios registrarse e iniciar sesión para gestionar sus reservas. Solo los usuarios autenticados pueden realizar una reserva de habitación.

### Consumo de API

El sistema utiliza llamadas a APIs externas y propias para gestionar la comunicación entre la base de datos y la interfaz del usuario. Las funciones principales son:

- _GET_: Recupera información de la base de datos, como la lista de habitaciones disponibles, precios, y datos de reservas.
- _POST_: Permite a los usuarios registrar nuevas reservas o enviar datos desde formularios.
- _PUT_: Actualiza información existente, como modificar detalles de una reserva o actualizar datos de usuarios.

### Ejecución de Funciones

En el archivo js/ se encuentran diversas funciones para:

- Validación de formularios.
- Interacción dinámica con el DOM.
- Llamadas asíncronas a la API utilizando fetch() para asegurar una experiencia fluida y sin recargas de página.

### Diseño Interactivo y Minimalista

El diseño de la plataforma es interactivo, ofreciendo una experiencia amigable al usuario. Se ha optado por un enfoque visual agradable y minimalista para facilitar la navegación y mejorar la usabilidad.

### Diseño Responsivo

Gracias a los estilos definidos en css/, la plataforma es completamente responsiva, garantizando un acceso óptimo desde dispositivos móviles, tabletas y computadoras de escritorio.

### Navegación Modular

El proyecto incluye múltiples páginas alojadas en pages/, lo que permite una navegación organizada y modular.

## Tecnologías Utilizadas

- _HTML5 y CSS3_: Para la estructura y diseño del sitio web.
- _JavaScript_: Para la lógica y manipulación dinámica del sitio.
- _Fetch API_: Para la comunicación con el servidor y la base de datos.
- _GitHub Pages_: Para la implementación de la base de datos en línea.
- _Render_: Como servidor gratuito para la base de datos JSON.

## Cómo Ejecutar el Proyecto

1. Clona el repositorio en tu máquina local:
   bash
   git clone <url-del-repositorio>

## Cómo Ejecutar el Proyecto

2. Navega al directorio del proyecto:
   bash
   cd <nombre-del-proyecto>

   2. Abre el archivo index.html en tu navegador preferido.

## Consideraciones Adicionales

- Asegúrate de tener acceso a internet para conectarte al servidor de la base de datos.
- Revisa las configuraciones en los scripts de JavaScript para garantizar la correcta dirección del servidor.

## Contribuciones

Este proyecto es de código abierto y se aceptan contribuciones. Para colaborar, realiza un fork del repositorio, haz tus cambios y envía un pull request.

## Autor

Este proyecto fue desarrollado por Warllen Romero como proyecto final del módulo de JavaScript, con el objetivo de optimizar la gestión hotelera a través de tecnologías web modernas.
