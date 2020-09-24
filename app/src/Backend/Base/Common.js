const noop = () => {};

class Common {

  // Visible backend name
  // Change when subclassing
  name = "Common";

  // Abort controller
  // Used to stop pending fetches when user changes the date
  controller = new AbortController();

  constructor(props) {
    this.onUpdate = props && props.onUpdate ? props.onUpdate : noop;
    this.onError = props && props.onError ? props.onError : noop;
  }

  // Abort the abort controller and clean it up creating a new one for next fetches
  // Add here all side-effects cancelling (fetches, timers, etc)
  // Remember to call super() when subclassing
  abort() {
    this.controller.abort();
    this.controller = new AbortController();
  }

  // Raises exception on response error
  handleFetchErrors = (response) => {
    // Raise succeeded non-ok responses
    if ( !response.ok ) {
      return new Error(`${this.name} backend: ${response.statusText}`);
    }
    return response;
  }

  // Catches fetch errors, original or 'self-raised', and throws to `onError` prop
  // Filters out non-error "Connection aborted"
  catchFetchErrors = (err) => {
    if ( err.name === 'AbortError' ) {
      console.log('Connection aborted', err);
    }
    else {
      err.message = `${this.name} backend: ${err.message}`;
      this.onError(err);
    }
  }
}

export default Common;
