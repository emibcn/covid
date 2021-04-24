const common = {
  "Covid Data - Refactored": "Covid Data - Refactored",
  "Covid Data": "Covid Data",
  "Refactored": "Refactored",
  "Close": "Close",
  "About...": "About...",
  "Language": "Language",
  "Theme": "Theme",
  "Help": "Help",
  "Yes": "Yes",
  "No": "No",
  "or": "or",
};

const chartEdit = {
  "Dataset": "Dataset",
  "Select the dataset": "Select the dataset",
};

const translations = {
  locale: "en",
  name: "English",

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
    "Try recreating this component to recover from the error": "Try recreating this component to recover from the error",
    "Counter": "Counter",
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

  Theme :{
    ...common,
    "Light": "Light",
    "Dark": "Dark",
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
    "Barcelona Chart": "Barcelona Chart",
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
    "Edit BCN parameters": "Edit BCN parameters",
  },

  'Widget/Map/Edit': {
    "Type": "Type",
    "Select the regions type to show": "Select the regions type to show",
    "Values": "Values",
    "Select the data origin": "Select the data origin",
  },

  'Widget/Chart/Edit': {
    ...chartEdit,
    "Division": "Division",
    "Select the division type to show": "Select the division type to show",
    "Population": "Population",
    "Select the population": "Select the population",
    "Extensió": "Extensió",
    "Risc iEPG": "Risc iEPG",
    "Region": "Region",
    "Select the region": "Select the region",
    "Tracking": "Tracking",
    "Situation": "Situation",
  },

  'Widget/Bcn/Edit': {
    ...chartEdit,
  },

};

export default translations;
