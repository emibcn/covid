![Node.js CI](https://github.com/emibcn/covid/workflows/Node.js%20CI/badge.svg)
![Coverage](https://raw.githubusercontent.com/emibcn/covid/badges/master/test-coverage.svg)
![Download maps from backend and publish with GitHub Pages](https://github.com/emibcn/covid-data/workflows/Download%20maps%20from%20backend%20and%20publish%20with%20GitHub%20Pages/badge.svg)

# Covid Data Web Application `refactored`

[This applications](https://emibcn.github.io/covid) displays public information about Covid19 Pandemy on Catalonia, extracted from the official web [https://dadescovid.cat](https://dadescovid.cat).

The aim of this application is to display the data in different ways than the original, improving performance and adding more value to it.

- [Contributing](#contributing)
- [Thanks to](#thanks-to)
- [How it works](#how-it-works)
  - [The frontend](#the-frontend)
    - [Features](#features)
  - [The backend](#the-backend)
- [TODO list](#todo-list)
- [Disclaimer](#disclaimer)
- [Licenses](#licenses)

<p align="center">
  <img src="https://github.com/emibcn/covid/raw/badges/images/covid-data-example-01.png" alt="App Screenshot" style="max-width:80%;">
</p>

# Contributing

This application has been made to help others better understand the situation and evolution of the Covid19 pandemy in the region of Catalunya.

If you have an idea about:
- Improve app performance, design, usability, testing or translations
- Add data sources
- Add visualization widgets
- Add regions
- Have funds or can look for them to speed up all the development processes
- Something else?

Please, [open an issue](https://github.com/emibcn/covid/issues) and let me know. If you're a developer, designer or translator (or just a user) and want to help develop, design, translate or test this app, let me know by [opening an issue](https://github.com/emibcn/covid/issues) or -still better!- [opening a pull request](https://github.com/emibcn/covid/pulls).

There are some already opened _simple_ issues. If you feel you can afford one of them, just comment on it (so nobody starts duplicating work in parallel) and commit a PR when you think you are all done with it. If you don't know what a PR is, you can read [these open source guidelines](https://www.digitalocean.com/community/tutorial_series/an-introduction-to-open-source).

All contributors will be rewarded :trophy: by thanking them here (unless you prefer not to)! If funds are found, they will be fairly distributed across all contributors.

# Thanks to

- [<img align="center" width="30px" height="30px" src="https://avatars2.githubusercontent.com/u/37369782?s=30&u=e45dece2e5b8aadb65b9b191bc12c46f60ad0512&v=4" />](https://github.com/MiguelMJ) [MiguelMJ](https://github.com/MiguelMJ) for the [Spanish translation](https://github.com/emibcn/covid/blob/master/app/src/i18n/es-es.lang.js)
- [<img align="center" width="30px" height="30px" src="https://avatars3.githubusercontent.com/u/163973?s=30&u=e45dece2e5b8aadb65b9b191bc12c46f60ad0512&v=4" />](https://github.com/wikiyu) [Wiktor Jędrzejczak](https://github.com/wikiyu) for the [Polish translation](https://github.com/emibcn/covid/pull/7)

# How it works

The application has been split into 2 parts: the frontend (this one, [the application you see deployed here](https://emibcn.github.io/covid)) and the backend (the one containing the data used in the frontend, updated daily with official data).

## The frontend

This applications has been created using [Create React App](https://create-react-app.dev/). The applications is built and deployed to [GitHub Pages](https://emibcn.github.io/covid) using it's [workflow](./github/worflows/node.js.yml).

The frontend is a React web application. It's intended to be used directly from the browser, or installed as a Progressive Web Application. It should work in all devices and browsers (if not, [open an issue](https://github.com/emibcn/covid/issues) and I will do my best). Some of the code in this app is inspired from the code in the [official app](https://dadescovid.cat). Specifically, how it handles the data sources against the SVG maps.

### Features

This application **does not use any tracking system** by itself, only the ones that could use GitHub Pages (they own the servers, they know the client IP). This means I have no feedback of the use of the app, so let a **star** or a **follow**, an issue or a pull request. They all are welcome! (Specially the last one :P ). It also means there is **no EU cookie disclaimer/acceptance button**, there is **no one spying** here, there are **no ads**.

The application lets you **add more visual widgets into the grid/dashboard**. The configuration of those widgets is **saved in the location of the web browser** (the `hash`), so you can undo or go back easily with native browser back/forward control. It's also useful to share a dashboard or a widget, as its URL contains its configuration. Furthermore, the app saves the same configuration into the **`localStorage`** system of your browser. If you come back to the app without your preferred configuration in the URL, it will automatically load it from the `localStorage`. Each time a parameter is modified, it is saved and all needed data is downloaded.

Each widget have a menu button where you can find its actions: _Edit_, _Remove_ and _Legend_. Those actions open a dialog to show information to you or let you change some parameters.

There is a Slider with a **Play/Pause button** to handle the day the data is shown for. The Play/Pause button enables/disables the automatic day increase and restart, helping you to see time-based correlations.

The application automatically detects when the **used data has been updated** and need to be redownloaded, and when the **application itself has been updated**, and notifies the user to apply the updates.

The application have a Menu with an _About_ section. An _Update!_ section is visible when an app update is available. There are more to come!

## The _backend_

The backend (the real one) are **servers from institutions** like the _Generalitat de Catalunya_ or others that may come in the future. Those servers might have strict security restrictions (like CORS), or might not perform as desired, or the data offered there has already been processed, or because the data is updated just once a day (and we don't need to bomb the servers).

Anyway, those backends are **scrapped once a day by a [workflow](https://github.com/emibcn/covid-data/blob/master/.github/workflows/get-maps-and-charts.yml)** on a sibling project: [covid-data](https://github.com/emibcn/covid-data). That project consists in a small shell script that downloads the Maps data -and processes it a bit- and a full JS project to download Charts data. Finally, deploys all collected data to its own **GitHub Pages**. That deploy is not intended to be used directly from your browser, but through this application, which downloads the data (JSON and SVG files) to fill in the app widgets.

So, in fact, this is a ***serverless application**, where _the cloud_ is provided by GitHub, GitHub Workflow and GitHub Pages (all with free tiers), and the original 3rd party backends, which are not part of this project (for the moment).

# TODO list

- Add Chart Widget.
- Add language selector and translate remaining components. Add languages (like spanish).
- Add more sections: _Help_, _Settings_, ...
- Change branding icons.
- Add tutorial for beginners.
- Add more data sources.
- Add more regions.
- Take a look at Google Maps iEPG new layer service.
- Add tests.

# Disclaimer

This app and the code are released as-is. The app may fail because there is a problem with GitHub or its servers (probably at Azure), or because the app itself (the code) has a bug, or because its deploy process has failed in some step. If your work or the live of someone relies on this app, please, install your own stack and pay someone to ensure it does not fails ([and let me know!](https://github.com/emibcn/covid/issues) I could be that paid _someone_).

This is a _Work in progress_ in its very early stages. All contributions are welcome, including writing a good _Contributing_ and _Code of conduct_ sections here.

# Licenses

The application, scripts and documentation in this project are released under the [GNU General Public License v3.0](https://github.com/emibcn/covid/blob/master/LICENSE).

The scripts and documentation published in [covid-data](/emibcn/covid-data) are also released under the [GNU General Public License v3.0](https://github.com/emibcn/crypt-disk-image/blob/master/LICENSE).

The data scrapped and published in [covid-data](/emibcn/covid-data) is licensed by their owner, the _Generalitat de Catalunya_, under their own conditions ([Open Data Commons Attribution License](http://opendatacommons.org/licenses/by/1.0/) until now). See more at the [dataset API documentation](https://analisi.transparenciacatalunya.cat/Salut/Dades-setmanals-de-COVID-19-per-comarca/jvut-jxu8).
