const common = {
  "Covid Data - Refactored": "Covid informasjon - Refaktorert",
  "Covid Data": "Covid Informasjon",
  "Refactored": "Refaktorert",
  "Close": "lukk",
  "About...": "Om...",
  "Language": "Språk",
  "Theme": "Theme",
  "Help": "Hjelp",
  "Yes": "Ja",
  "No": "Nei",
  "or": "eller",
};

const chartEdit = {
  "Dataset": "Datasett",
  "Select the dataset": "Velg datasett",
};

const translations = {
  locale: "no",
  name: "Norsk",

  App: {
    ...common,
  },

  Copyright: {
    ...common,
    "Source code of:": "Kildekoden til:",
  },

  ErrorCatcher: {
    ...common,
    "Something went wrong :(": "Noe gikk galt :(",
    "Try reloading the app to recover from it": "Prøv å starte appen på nytt for å gjenopprette fra det",
    // TODO:
    "Try recreating this component to recover from the error": "Try recreating this component to recover from the error",
    "Counter": "Counter",
  },

  Menu: {
    ...common,
    "Menu": "Meny",
    "Update!": "Oppdater!",
    "New update available!": "Ny oppdatering tilgjengelig!",
  },

  ModalRouter: {
    ...common,
  },

  About: {
    ...common,
    "This applications displays public information extracted from the official web": "Denne applikasjonen viser offentlig informasjon hentet ut fra det offesielle nett",
    "The aim of this application is to display the data in different ways than the original, improving performance and adding more value to it.": "Målet med denne applikasjonen er å vise infromasjon på ulike måter enn den originale, forbedre ytelse og legger merverdi til den.",
    "Want more information?": "Vil du ha mer informasjon?",
    "The source code is publicly available.": "Kildekoden er offentlig tilgjengelig.",
    "There, you can find more information about how it has been done, licence and credits.": "Der kan du finne mer infromasjon om hvordan det har blitt gjordt, lisens og There, you can find more information og kreditter.",
    "Found a bug? Have a petition? Want to help somehow?": "Fant en feil? Har en begjøring? Lyst til å hjelpe?",
    "Create an issue at GitHub.": "Opprett en sak på GitHub.",
    "Licenses": "Lisenser",
    "The application, scripts and documentation in": "Applikasjonen, skripts og dokumentasjon i",
    "this project": "dette prosjektet",
    "are released under the": "er utgitt under",
    "The scripts and documentation published in": "Skriptene og dokumentasjonen publisert i",
    "are also released under the": "er også utgitt under",
    "The data scrapped and published in": "Informasjonen som er skrapet og publisert i",
    "is licensed by their owner, the": "er lisensert av eieren",
    ", under their own conditions (": ", under deres egne forhold (",
    ", until now).": ", inntil videre).",
    "See more at the": "Se more på",
    "dataset API documentation": "dataset API dokumentasjonen",
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
    "Map": "Kart",
    "Chart": "Diagram",
    "Barcelona Chart": "Barcelona Diagram",
    "Add a graph": "Legg til en graf",
    "add": "legg til",
  },

  PlayPause: {
    ...common,
    "Toggle play status": "Endre spill status",
    "play": "spill",
    "pause": "pause",
  },

  Widget: {
    ...common,
    "remove": "fjern",
    "Remove": "Fjern",
    "Remove?": "Fjern?",
    "Confirm removal": "Bekreft fjerning",
    "View": "Vis",
    "Edit": "Rediger",
    "Legend": "Legende",
    "Edit map parameters": "Rediger kart parametere",
    "Edit chart parameters": "Rediger graf parametere",
    "Edit BCN parameters": "Rediger BCN parametere",
  },

  'Widget/Map/Edit': {
    "Type": "Type",
    "Select the regions type to show": "Velg regionene bdu ønsker å vise",
    "Values": "Verdier",
    "Select the data origin": "Velg datakilde",
  },

  'Widget/Chart/Edit': {
    ...chartEdit,
    "Division": "Divisjon",
    "Select the division type to show": "Velg divisjonstype å vise",
    "Population": "Populasjon",
    "Select the population": "Velg populasjon",
    "Extensió": "Extensió",
    "Risc iEPG": "Risc iEPG",
    "Region": "Region",
    "Select the region": "Velg region",
    "Tracking": "Tracking",
    "Situation": "Situation",
  },

  'Widget/Bcn/Edit': {
    ...chartEdit,
  },

};

export default translations;
