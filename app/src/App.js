import React from 'react';
import PropTypes from 'prop-types';
import { HashRouter as Router } from 'react-router-dom';

import Storage from 'react-simple-storage';
import { TranslatorProvider, useTranslate } from 'react-translate';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import available from './i18n/available';

import ErrorCatcher from './ErrorCatcher';
import Dashboard from './Dashboard';
import { WidgetsList } from './Widget';

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
      <AppHelmet language={ props.language } />
      <Router>
        <div className='App' id='router-container'>
          { props.children }
        </div>
      </Router>
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
  const languageNav = navigator.language.toLowerCase();
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

    this.registration = false; // For App updates
    const language = getDefaultLanguage(available);
    this.state = {
      initializing: true,              // For Storage
      newServiceWorkerDetected: false, // For App updates
      language,
      theme: false,                    // Use defined by user in browser
      tutorialSeen: false,
    };
  }

  componentDidMount() {
    // Receive message from index.js when a new service worker has been detected
    document.addEventListener('onNewServiceWorker', this.handleNewServiceWorker);
  }

  componentWillUnmount() {
    // Remove event listener
    document.removeEventListener('onNewServiceWorker', this.handleNewServiceWorker);
  }

  // When new serviceWorker is accepted, save the registration object
  // and change own state, which will be passed to Dashboard to let the user upgrade
  handleNewServiceWorker = (event) => {
    this.registration = event.detail.registration;
    this.setState({
      newServiceWorkerDetected: true,
    });
  }

  // Once the user accepts to update, call index.js callback
  handleLoadNewServiceWorkerAccept = () => this.props.onLoadNewServiceWorkerAccept(this.registration);

  // Handle global configuration options
  handleLanguageChange = (language) => this.setState({ language });
  handleThemeChange = (theme) => this.setState({ theme });
  handleTutorialSeenChange = (tutorialSeen) => this.setState({ tutorialSeen });

  render() {
    const { newServiceWorkerDetected, language, theme, tutorialSeen } = this.state;
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
            blacklist={ ['newServiceWorkerDetected','initializing'] }
            onParentStateHydrated={ () => this.setState({ initializing: false }) }
          />
        </ErrorCatcher>

        {/* Shows the app, with ErrorBoundaries */}
        <ErrorCatcher origin='Dashboard'>
          <Dashboard
            // Handle App update acceptance by user
            newServiceWorkerDetected={ newServiceWorkerDetected }
            onLoadNewServiceWorkerAccept={ this.handleLoadNewServiceWorkerAccept }
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
            <ErrorCatcher origin='WidgetsList'>
              <WidgetsList />
            </ErrorCatcher>
          </Dashboard>
        </ErrorCatcher>
      </AppProviders>
    );
  }
}

App.propTypes = {
  onLoadNewServiceWorkerAccept: PropTypes.func.isRequired,
};

export default App;
export {fixLocationHash, getDefaultLanguage}; // For tests
