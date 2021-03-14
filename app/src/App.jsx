import React from 'react';
import { HashRouter as Router } from 'react-router-dom';

import Storage from 'react-simple-storage';
import { TranslatorProvider, useTranslate } from 'react-translate';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import available from './i18n/available';

import ErrorCatcher from './ErrorCatcher';
import Dashboard from './Dashboard';
import { WidgetsList } from './Widget';

import { BackendProvider, IndexesHandler } from './Backend';

// App Helmet: Controls HTML <head> elements with SideEffect
// - Set a default title and title template, translated
const AppHelmet = (props) => {
  const t = useTranslate("App");
  const title = t("Covid Data - Refactored");
  return (
    <Helmet
      titleTemplate={ `%s | ${ title }` }
      defaultTitle={ title }
    >
      <html lang={ props.language } />
    </Helmet>
  );
}

// Concentrate all providers (4) used in the app into a single component
const AppProviders = (props) => (
  <TranslatorProvider translations={ props.translations }>
    <HelmetProvider>
      <BackendProvider>
        <AppHelmet language={ props.language } />
        <Router>
          <div className='App' id='router-container'>
            { props.children }
          </div>
        </Router>
      </BackendProvider>
    </HelmetProvider>
  </TranslatorProvider>
);

const fixLocationHash = () => {
  const decoded = decodeURIComponent(global.location.hash);
  if ( decoded !==  '' && decoded !== global.location.hash ) {
    const hash = decoded.replace(/[^#]*(#.*)$/, '$1');
    global.location.replace(hash);
  }
}

const getDefaultLanguage = (available) => {
  const languageNav = (global.navigator.language ?? '').toLowerCase();
  return available
    .find(language => language.key === languageNav)
      ? languageNav
      : 'ca-es';
}

class App extends React.Component {

  constructor() {
    super();

    // Fix bad browser encoding HASH
    fixLocationHash();

    const language = getDefaultLanguage(available);
    this.state = {
      initializing: true,  // For Storage
      language,
      theme: false,        // Use defined by user in browser
      tutorialSeen: false,
    };
  }

  // Handle global configuration options
  handleLanguageChange = (language) => this.setState({ language });
  handleThemeChange = (theme) => this.setState({ theme });
  handleTutorialSeenChange = (tutorialSeen) => this.setState({ tutorialSeen });

  render() {
    const { language, theme, tutorialSeen } = this.state;
    const translations = available.find(_language => _language.key === language).value;

    return (
      <AppProviders { ...{
          translations,
          language,
        }}
      >

        {/* Persistent state saver into localStorage */}
        <ErrorCatcher origin='Storage'>
          <Storage
            parent={ this }
            prefix='App'
            blacklist={ ['initializing'] }
            onParentStateHydrated={ () => this.setState({ initializing: false }) }
          />
        </ErrorCatcher>

        {/* Shows the app, with ErrorBoundaries */}
        <ErrorCatcher origin='Dashboard'>
          <Dashboard
            // Use language and handle its change
            language={ language }
            onLanguageChange={ this.handleLanguageChange }
            // Use theme and handle its change
            theme={ theme }
            onThemeChange={ this.handleThemeChange }
            // Force tutorial?
            tutorialSeen={ tutorialSeen }
            onTutorialSeen={ this.handleTutorialSeenChange }
          >
            <ErrorCatcher origin='IndexesHandler'>
              <IndexesHandler>
                <ErrorCatcher origin='WidgetsList'>
                  <WidgetsList />
                </ErrorCatcher>
              </IndexesHandler>
            </ErrorCatcher>
          </Dashboard>
        </ErrorCatcher>
      </AppProviders>
    );
  }
}

export default App;
export {fixLocationHash, getDefaultLanguage}; // For tests
