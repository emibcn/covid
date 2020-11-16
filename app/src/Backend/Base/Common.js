const noop = () => {};

const log = (...args) => {
  if (['development', 'test'].includes(process.env.NODE_ENV)) {
    console.log(...args);
  }
}

class Common {

  // Visible backend name
  // Change when subclassing
  name = "Common";

  // Abort controller
  // Used to stop pending fetches when user changes the date
  controller = new AbortController();

  // Overload to do something useful with errors
  onError = noop;

  // Can overload onError also on instantiation time
  constructor({onError} = {}) {
    this.onError = onError || this.onError;
  }

  // Abort the abort controller and clean it up creating a new one for next fetches
  // Add here all side-effects cancelling (fetches, timers, etc)
  // Remember to call super() when subclassing
  abort = () => {
    this.controller.abort();
    this.controller = new AbortController();
  }

  // Raises exception on response error
  handleFetchErrors = (response) => {
    // Raise succeeded non-ok responses
    if ( !response.ok ) {
      throw new Error(response.statusText);
    }
    return response;
  }

  // Catches fetch errors, original or 'self-raised', and throws to `onError` prop
  // Filters out non-error "Connection aborted"
  catchFetchErrorsMessage = (err) => `${this.name} backend: ${err.message}`;
  catchFetchErrorsAbortMessage = (err) => 'Connection aborted';
  catchFetchErrors = (err) => {
    if ( err.name === 'AbortError' ) {
      console.log(this.catchFetchErrorsAbortMessage());
    }
    else {
      err.message = this.catchFetchErrorsMessage(err);
      this.onError(err);
    }
  }

  log = log;
}

export default Common;
export {log};
