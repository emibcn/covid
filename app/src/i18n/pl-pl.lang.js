const common = {
    "Covid Data - Refactored": "Covid Data - Refactored",
    "Covid Data": "Covid Data",
    "Refactored": "Refactored",
    "Close": "Zamknij",
    "About...": "O Covid Data...",
    "Language": "Język",
    "Help": "Pomoc",
    "Yes": "Tak",
    "No": "Nie",
    "or": "albo",
};

const chartEdit = {
  "Dataset": "Dane",
  "Select the dataset": "Wybierz zbiór danych",
};

export default {
  locale: "pl",
  name: "Polish",

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
    "The aim of this application is to display the data in different ways than the original, improving performance and adding more value to it.": "Celem aplikacji jest pokazanie danych w inny sposób niż dotychczas dostępne, poprawienie wydajności oraz wartościowe ich ukazanie",
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

  Language: {
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
    "Map": "Mapa",
    "Chart": "Wykres",
    "Barcelona Chart": "Barcelona Wykres",
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
    "Remove?": "Usunąć?",
    "Confirm removal": "Potwierdź usunięcie",
    "View": "Widok",
    "Edit": "Edycja",
    "Legend": "Legenda",
    "Edit map parameters": "Edytuj parametry mapy",
    "Edit chart parameters": "Edytuj parametry wykresu",
    "Edit BCN parameters": "Edytuj parametry BCN",
  },

  'Widget/Map/Edit': {
    "Type": "Typ",
    "Select the regions type to show": "Wybierz regiony do pokazania",
    "Values": "Wartość",
    "Select the data origin": "Wybierz źródło",
  },

  'Widget/Chart/Edit': {
    ...chartEdit,
    "Division": "Podział administracyjny",
    "Select the division type to show": "Wybierz podział administracyjny",
    "Population": "Populacja",
    "Select the population": "Wybierz populację",
    "Extensió": "Extensió",
    "Risc iEPG": "Risc iEPG",
    "Region": "Region",
    "Select the region": "Wybierz region",
  },

  'Widget/Bcn/Edit': {
    ...chartEdit,
  },

}
