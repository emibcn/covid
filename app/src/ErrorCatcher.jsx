import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSyncAlt as faRefresh } from '@fortawesome/free-solid-svg-icons'
import { translate } from 'react-translate'

// Catches unhandled errors:
// - Show it to user
// - Send them to GA to help improve app
class ErrorCatcher extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
      errorStack: '',
      info: '',
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {
      hasError: true,
      errorMessage: error.message,
      errorStack: error.stack,
    };
  }

  // Catch unhandled errors and send them to help improving the app
  componentDidCatch(error, info) {

    this.setState({
      info: info.componentStack,
    });

    this.sendEvent('Unhandled Error');
  }

  reloadApp = () => {
    this.sendEvent('Reload from Error');

    // Reload app
    window.location.reload();
  }

  // Send event to GA
  sendEvent(event) {
    this.props.sendEvent(event, this.props.origin, this.state.errorMessage);
  }

  render() {
    if (this.state.hasError) {
      const { t } = this.props;
      const { errorMessage, errorStack } = this.state;

      // Show error to user
      return (
        <>
          <h1>{ t('Something went wrong :(') }</h1>
          <button
            onClick={ this.reloadApp }
            style={{ padding: '1em' }}
          >
            <FontAwesomeIcon
              icon={ faRefresh }
              style={{ margin: '0 .8em 0 .2em' }}
            />
            { t("Try reloading the app to recover from it") }
          </button>
          <div style={{ textAlign: 'left' }}>
            <h3>{ errorMessage }</h3>
            <details style={{ whiteSpace: "pre-wrap" }}>
              { errorStack }
            </details>
          </div>
        </>
      );
    }

    return this.props.children
  }
}

ErrorCatcher.defaultProps = {
  origin: 'No name',
  sendEvent: () => {},
};

ErrorCatcher.propTypes = {
  origin: PropTypes.string.isRequired,
  sendEvent: PropTypes.func.isRequired,
};

export default translate('ErrorCatcher')(ErrorCatcher);
