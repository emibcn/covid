const common = {
    "Covid Data - Refactored": "Covid Data - Refactored",
    "Covid Data": "Covid Data",
    "Refactored": "Refactored",
    "Close": "Close",
    "About": "About...",
    "Language": "Language",
    "Help": "Help",
    "Yes": "Yes",
    "No": "No",
    "or": "or",
};

const languages = {
  en: "English",
  es: "Spanish",
  fr: "French",
}

export default {
  locale: "en",
  languages,

  App: {
    ...common,
  },

  Copyright: {
    ...common,
    "Source code of:": "Source code of:",
  },

  ErrorCatcher: {
    ...common,
    "Something went wrong :(": "Something went wrong :(",
    "Try reloading the app to recover from it": "Try reloading the app to recover from it",
  },

  Menu: {
    ...common,
    "Menu": "Menu",
    "Update!": "Update!",
    "New update available!": "New update available!",
  },

  ModalRouter: {
    ...common,
  },

  About: {
    ...common,
    "This applications displays public information extracted from the official web": "This applications displays public information extracted from the official web",
    "The aim of this application is to display the data in different ways than the original, improving performance and adding more value to it.": "The aim of this application is to display the data in different ways than the original, improving performance and adding more value to it.",
    "Want more information?": "Want more information?",
    "The source code is publicly available.": "The source code is publicly available.",
    "There, you can find more information about how it has been done, licence and credits.": "There, you can find more information about how it has been done, licence and credits.",
    "Found a bug? Have a petition? Want to help somehow?": "Found a bug? Have a petition? Want to help somehow?",
    "Create an issue at GitHub.": "Create an issue at GitHub.",
    "Licenses": "Licenses",
    "The application, scripts and documentation in": "The application, scripts and documentation in",
    "this project": "this project",
    "are released under the": "are released under the",
    "The scripts and documentation published in": "The scripts and documentation published in",
    "are also released under the": "are also released under the",
    "The data scrapped and published in": "The data scrapped and published in",
    "is licensed by their owner, the": "is licensed by their owner, the",
    ", under their own conditions (": ", under their own conditions (",
    ", until now).": ", until now).",
    "See more at the": "See more at the",
    "dataset API documentation": "dataset API documentation",
  },

  Language :{
    ...common,
  },

  Help: {
    ...common,
  },

  WidgetsList: {
    ...common,
  },

  MenuAddWidget: {
    ...common,
    "Map": "Map",
    "Chart": "Chart",
    "Add a graph": "Add a graph",
    "add": "add",
  },

  PlayPause: {
    ...common,
    "Toggle play status": "Toggle play status",
    "play": "play",
    "pause": "pause",
  },

  Widget: {
    ...common,
    "remove": "remove",
    "Remove": "Remove",
    "Remove?": "Remove?",
    "Confirm removal": "Confirm removal",
    "View": "View",
    "Edit": "Edit",
    "Legend": "Legend",
    "Edit map parameters": "Edit map parameters",
    "Edit chart parameters": "Edit chart parameters",
  },

  'Widget/Map/Edit': {
    "Type": "Type",
    "Select the regions type to show": "Select the regions type to show",
    "Values": "Values",
    "Select the data origin": "Select the data origin",
  },

  'Widget/Chart/Edit': {
    "Division": "Division",
    "Select the division type to show": "Select the division type to show",
    "Population": "Population",
    "Select the population": "Select the population",
    "Dataset": "Dataset",
    "Select the dataset": "Select the dataset",
    "Extensió": "Extensió",
    "Risc iEPG": "Risc iEPG",
    "Region": "Region",
    "Select the region": "Select the region",
  },
}
