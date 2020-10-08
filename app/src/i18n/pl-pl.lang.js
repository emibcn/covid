const common = {
    "Covid Data - Refactored": "Covid Data - Refactored",
    "Covid Data": "Covid Data",
    "Refactored": "Refactored",
    "Close": "Zamknij",
    "About": "O Covid Data...",
    "Language": "Język",
    "Help": "Pomoc",
    "Yes": "Tak",
    "No": "Nie",
    "or": "albo",
};

const languages = {
  en: "angielski",
  es: "hiszpański",
  fr: "Francuski",
}

export default {
  locale: "pl",
  languages,

  App: {
    ...common,
  },

  Copyright: {
    ...common,
    "Source code of:": "Kod źródłowy:",
  },

  ErrorCatcher: {
    ...common,
    "Something went wrong :(": "Coś poszło nie tak :(",
    "Try reloading the app to recover from it": "Spróbuj odświeżyć stronę by się z tego wydostać",
  },

  Menu: {
    ...common,
    "Menu": "Menu",
    "Update!": "Aktualizacja!",
    "New update available!": "Nowa aktualizacja dostępna!",
  },

  ModalRouter: {
    ...common,
  },

  About: {
    ...common,
    "This applications displays public information extracted from the official web": "Aplikacja pokazuje publicznie dostępne informacje z oficjalnych źródeł",
    "The aim of this application is to display the data in different ways than the original, improving performance and adding more value to it.": "Celem aplikacji jest pokazanie danych na inne sposoby niż dotychczas dostępne, dając wartość ze sposobu ukazania ich.",
    "Want more information?": "Potrzebujesz więcej informacji?",
    "The source code is publicly available.": "Kod źródłowy jest dostępny publicznie.",
    "There, you can find more information about how it has been done, licence and credits.": "Tutaj możesz znaleźć informacje o powstawaniu aplikacji, licencjach oraz autorach.",
    "Found a bug? Have a petition? Want to help somehow?": "Błąd? Pomysł? Chcesz pomóc?",
    "Create an issue at GitHub.": "Stwórz ticket na GitHubie.",
    "Licenses": "Licencje",
    "The application, scripts and documentation in": "Aplikacja, skrypty i dokumentacja w",
    "this project": "ten projekt",
    "are released under the": "jest wydawany w ramach",
    "The scripts and documentation published in": "Skrypty i dokumentacja udostępniona w ",
    "are also released under the": "także udostępniane jako",
    "The data scrapped and published in": "Dane pochodzące i udostępnione w",
    "is licensed by their owner, the": "licencjonowane przez właściciela: ",
    ", under their own conditions (": ", na ich własnych zasadach (",
    ", until now).": ", dotychczas).",
    "See more at the": "Sprawdź więcej na",
    "dataset API documentation": "dokumentacja źródła API",
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
    "Chart": "Wykres",
    "Add a graph": "Dodaj wykres",
    "add": "dodaj",
  },

  PlayPause: {
    ...common,
    "Toggle play status": "Przełącz status",
    "play": "play",
    "pause": "pause",
  },

  Widget: {
    ...common,
    "remove": "usuń",
    "Remove": "Usuń",
    "Remove?": "Usunąć??",
    "Confirm removal": "Potwierdź usunięcie",
    "View": "Widok",
    "Edit": "Edycja",
    "Legend": "Legenda",
    "Edit map parameters": "Edytuj parametry mapy",
    "Edit chart parameters": "Edytuj parametry wykres",
  },

  'Widget/Map/Edit': {
    "Type": "Typ",
    "Select the regions type to show": "Wybierz regiony do pokazania",
    "Values": "Wartość",
    "Select the data origin": "Wybierz źródło",
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
