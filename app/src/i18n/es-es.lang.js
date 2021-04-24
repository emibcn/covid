const common = {
  "Covid Data - Refactored": "Datos Covid - Refactorizada",
  "Covid Data": "Datos Covid",
  "Refactored": "Refactorizada",
  "Close": "Cerrar",
  "About...": "Sobre...",
  "Language": "Idioma",
  "Theme": "Apariencia",
  "Help": "Ayuda",
  "Yes": "Sí",
  "No": "No",
  "or": "o",
};

const chartEdit = {
    "Dataset": "Conjunto de datos",
    "Select the dataset": "Seleccionar el conjunto de datos a usar",
};

const translations = {
  locale: "es",
  name: "Castellano",

  App: {
    ...common,
  },

  Copyright: {
    ...common,
    "Source code of:": "Código fuente de",
  },

  ErrorCatcher: {
    ...common,
    "Something went wrong :(": "Algo ha ido mal :(",
    "Try reloading the app to recover from it": "Intenta recargar la aplicación para continuar",
    "Try recreating this component to recover from the error": "Intenta recargar este component para continuar",
    "Counter": "Recuento",
  },

  Menu: {
    ...common,
    "Menu": "Menú",
    "Update!": "¡Actualizar!",
    "New update available!": "¡Nueva actualización disponible!",
  },
  
  ModalRouter: {
    ...common,
  },

  About: {
    ...common,
    "This applications displays public information extracted from the official web": "Esta aplicación muestra información pública extraída de la página web oficial",
    "The aim of this application is to display the data in different ways than the original, improving performance and adding more value to it.": "El propósito de esta aplicación es mostrar los datos de una manera distinta al original, mejorando su rendimiento y añadiéndole más valor.",
    "Want more information?": "¿Quieres saber más?",
    "The source code is publicly available.": "El código fuente está disponible al público.",
    "There, you can find more information about how it has been done, licence and credits.": "Ahí puedes encontrar más información sobre cómo se ha hecho, la licencia y los créditos.",
    "Found a bug? Have a petition? Want to help somehow?": "¿Has encontrado un bug? ¿Tienes alguna petición? ¿Quieres ayudar de alguna forma?",
    "Create an issue at GitHub.": "Abre un nuevo issue en GitHub.",
    "Licenses": "Licencias",
    "The application, scripts and documentation in": "La aplicación, scripts y documentación de",
    "this project": "este projecto",
    "are released under the": "están publicados bajo la",
    "The scripts and documentation published in": "Los scripts y la documentación publicada en",
    "are also released under the": "también están publicados bajo la",
    "The data scrapped and published in": "Los datos recolectados y publicados en",
    "is licensed by their owner, the": "está bajo la licencia de su propietario, ",
    ", under their own conditions (": ", bajo sus propias condiciones (",
    ", until now).": ", hasta ahora).",
    "See more at the": "Ver más en la",
    "dataset API documentation": "documentación de la API del dataset",
  },
  
  Language: {
    ...common,
  },

  Theme :{
    ...common,
    "Light": "Clara",
    "Dark": "Oscura",
  },

  Help: {
    ...common,
  },

  WidgetsList: {
    ...common,
  },

  MenuAddWidget: {
    ...common,
    "Map": "Mapa",
    "Chart": "Gráfico",
    "Barcelona Chart": "Gráfico de Barcelona",
    "Add a graph": "Añadir un gráfico",
    "add": "añadir",
  },

  PlayPause: {
    ...common,
    "Toggle play status": "Conmutat el estado de reproducción",
    "play": "reproducir",
    "pause": "detener",
  },

  Widget: {
    ...common,
    "remove": "eliminar",
    "Remove": "Eliminar",
    "Remove?": "Eliminar?",
    "Confirm removal": "Confirmar la eliminación",
    "View": "Ver",
    "Edit": "Editar",
    "Legend": "Leyenda",
    "Edit map parameters": "Editar las opciones del mapa",
    "Edit chart parameters": "Editar las opciones del gráfico",
    "Edit BCN parameters": "Editar las opciones del elemento de BCN",
  },

  'Widget/Map/Edit': {
    "Type": "Tipo",
    "Select the regions type to show": "Seleccionar el tipo de regiones a mostrar",
    "Values": "Valores",
    "Select the data origin": "Selecciona el origen de los datos",
  },

  'Widget/Chart/Edit': {
    ...chartEdit,
    "Division": "División territorial",
    "Select the division type to show": "Seleccionar la división territorial a usar",
    "Population": "Población",
    "Select the population": "Seleccionar la población",
    "Extensió": "Extensión",
    "Risc iEPG": "Riesgo iEPG",
    "Region": "Región",
    "Select the region": "Seleccionar la región",
    "Tracking": "Seguimiento",
    "Situation": "Situación",
  },

  'Widget/Bcn/Edit': {
    ...chartEdit,
  },

};

export default translations;
