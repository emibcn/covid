import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSyncAlt as faRefresh } from '@fortawesome/free-solid-svg-icons'
import { translate } from 'react-translate'


const ShowErrorDefault = (props) => {
  const {onRetry, reloadOnRetry, errorMessage, errorStack, count, t} = props;
  return (
    <>
      <h1>{ t("Something went wrong :(") }</h1>
      <button
        onClick={ onRetry }
        style={{ padding: '1em' }}
      >
        <FontAwesomeIcon
          icon={ faRefresh }
          style={{ margin: '0 .8em 0 .2em' }}
        />
        { reloadOnRetry
            ? t("Try reloading the app to recover from it")
            : t("Try recreating this component to recover from the error")
        }
      </button>
      <div style={{ textAlign: 'left' }}>
        <h2>{ errorMessage }</h2>
        { reloadOnRetry ? null : (
            <p>{ t("Counter") }: { count }</p>
        )}
        <details style={{ whiteSpace: "pre-wrap" }}>
          { errorStack }
        </details>
      </div>
    </>
  )
}

ShowErrorDefault.defaultProps = {
  t: text => text,
};

ShowErrorDefault.propTypes = {
  onRetry: PropTypes.func.isRequired,
  reloadOnRetry: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
  errorStack: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
};

// Catches unhandled errors:
// - Show it to user
// - Send them to GA to help improve app
class ErrorCatcher extends React.PureComponent {

  initialState = {
    hasError: false,
    errorMessage: '',
    errorStack: '',
    info: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      ...this.initialState,
      count: 0,
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

    this.setState(
      ({count}) => ({
        info: info.componentStack,
        count: count + 1,
      }),
      () => this.sendEvent('Unhandled Error')
    );
  }

  reloadApp = () => {
    this.sendEvent('Reload page from Error');

    // Reload app
    window.location.reload();
  }

  retry = () => {
    if (this.props.reloadOnRetry) {
      this.reloadApp();
    }
    else {
      this.sendEvent('Reload component from Error');
      this.props.onRetry(this.state.count);
      this.setState({
        ...this.initialState
      });
    }
  }

  // Send event to GA
  sendEvent = (event) => {
    const {
      props: {sendEvent, origin},
      state: {errorMessage, count}
    } = this;
    sendEvent(
      event,
      origin,
      `${errorMessage} (${count})`);
  }

  render() {
    if (this.state.hasError) {
      const { reloadOnRetry, ShowError } = this.props;
      const { errorMessage, errorStack, count } = this.state;

      // Show error to user
      return (
        <ShowError
          onRetry={ this.retry }
          reloadOnRetry={ reloadOnRetry }
          errorMessage={ errorMessage }
          errorStack={ errorStack }
          count={ count }
        />
      )
    }

    // Execute contained components
    return this.props.children
  }
}

ErrorCatcher.defaultProps = {
  origin: 'No name',
  sendEvent: () => {},
  onRetry: () => {},
  reloadOnRetry: true,
  ShowError: translate('ErrorCatcher')(ShowErrorDefault),
};

ErrorCatcher.propTypes = {
  origin: PropTypes.string.isRequired,
  sendEvent: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired,
  reloadOnRetry: PropTypes.bool.isRequired,
  ShowError: PropTypes.elementType.isRequired,
};

const withErrorCatcher = (origin, component) =>
  <ErrorCatcher {...{ origin , key: origin }}>{ component }</ErrorCatcher>;

export default ErrorCatcher;
export { withErrorCatcher, ShowErrorDefault };
