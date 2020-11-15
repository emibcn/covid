import Common from './Common';

// Transform a string into a smaller/hash one of it
const hashStr = str => {
  if (str.length === 0) {
    return 0;
  }

  return [...str]
    .map( char => char.charCodeAt(0) )
    .reduce( (hash, int) => {
      const hashTmp = ((hash << 5) - hash) + int;
      return hashTmp & hashTmp; // Convert to 32bit integer
    }, 0)
}

const log = (...args) => {
  if (['development', 'test'].includes(process.env.NODE_ENV)) {
    console.log(...args);
  }
}

// Handles an element inside the cache
class FetchCacheElement extends Common {
  name = 'Cache Element';
  fetching = false;
  result = null;
  lastModified = 0;
  invalidated = false;
  listeners = [];
  url = '';

  constructor(url) {
    super();
    this.url = url;
  }

  // Handle a fetch error by calling all the listeners' onError in the queue
  onError = (error) => {
    this.listeners.forEach( listener => listener.onError(error));
    this.cleanFetch();
  };

  // Add `this.url` to error messages
  catchFetchErrorsMessage = (err) => `${this.url}: ${this.name} backend: ${err.message}`;

  // Removes all unneeded data related to a fetch
  cleanFetch = () => this.fetching = false;

  // Registers a listener
  addListener = (onSuccess, onError) => {
    this.listeners.push({
      onSuccess,
      onError,
    });

    // If this is the first listener, launch the fetch
    if (!this.fetching &&
        this.result === null ) {
      this.fetch();
    }

    // If we already have the data and it has not been invalidated, create
    // a self-resolving promise which executes the listener after resolution
    if ( !this.invalidated &&
         this.result !== null) {
      (new Promise(
        (resolve, reject) => resolve(this.result)
      )).then( onSuccess );
    }
    
    log(`Added listener to ${this.url}: ${this.listeners.length - 1}`);

    return () => this.removeListener( onSuccess );
  }

  // Disables/unregisters a listener
  removeListener = (onSuccess) => {

    // Finds the listener by comparing the onSuccess function pointer
    const found = this.listeners
      .map( (listener, index) => ({ listener, index }))
      .find( l => l.listener.onSuccess === onSuccess);

    if ( found ) {
      log(`Remove listener from ${this.url}: ${found.index}`);

      // Remove element from array
      this.listeners.splice(found.index, 1);
    }
    else {
      console.warn(`Remove listener from ${this.url}: Listener not found`);
    }

    // If there is an ongoing fetch and there are no more listeners left, abort the fetch
    if (this.fetching &&
        this.listeners.length === 0) {
      this.controller.abort();
      this.cleanFetch();
    }
  }

  // Caches the data and calls all the listeners' onSuccess
  processSuccessFetch = ({ result, lastModified }) => {
    this.result = result;
    this.lastModified = lastModified;
    this.listeners
      .forEach( listener => listener.onSuccess(this.result) );
 
    this.cleanFetch();

    // Allow re-chaining promises
    return this.result;
  }

  // Gets a Date object from a fetch response `last-modified` HTTP header
  getLastModifiedFromResponse = (response) => new Date(response.headers.get('last-modified'));

  // Fetches a URL:
  // - Transforms from JSON to JS object
  // - Gets last modified date
  // - Processes all listeners
  // - Calls the callback
  // - If there is an error, processes all error listeners
  fetch = (callback = () => {}) => {
    this.fetching = true;
    this.invalidated = false;
    return fetch( this.url, { signal: this.controller.signal })
      .then( this.handleFetchErrors )
      .then( response => response.json().then( result => ({
        result,
        lastModified: this.getLastModifiedFromResponse(response)
      }) ))
      .then( this.processSuccessFetch )
      .then( callback )
      .catch( this.catchFetchErrors )
      .finally( this.cleanFetch )
  }

  // Sends a HEAD request to download URL header's `last-modified` value and
  // returns the comparison against saved value: `true` if new one is higher
  checkIfNeedUpdate = (onSuccess, onError) => {
    return fetch( this.url, { method: 'HEAD' })
      .then( this.handleFetchErrors )
      .then( this.getLastModifiedFromResponse )
      .then( date => date > this.lastModified /* || true */ ) // TEST TODO BUG DEBUG
      .then( onSuccess )
      .catch( onError )
  }

  // Invalidates the cache and recalls it's download if we have any listener
  invalidate = () => {
    return (new Promise(
      (resolve, reject) => {
        if ( this.result !== null ) {
          this.invalidated = true;

          // Are there listeners?
          if ( this.listeners.length > 0 ) {
            log(`${this.url}: Fetch it!`);
            this.fetch(resolve);
          }
          else {
            // Resolve without doing nothing
            // Someone downloaded it, but unregistered from it: changed data source
            log(`${this.url}: Someone downloaded it, but unregistered from it: changed data source`);
            resolve();
          }
        }
        else {
          // Resolve without doing nothing
          // It was never downloaded
          log(`${this.url}: It was never downloaded`);
          resolve();
        }
      }
    ))
  }
}

// Handles the whole cache
// This is intended for a singleton aproach
class FetchCache {
  /*
     Cached data and fetch handlers:

     data = {
       [ hashStr(url) ]: new FetchCacheElement(url),
       ...
     }
  */
  data = {};

  name = "Cache manager";

  // Handles fetch requests:
  // - Creates a new fetch if it's the first time for this URL
  // - Adds fetch listener if there is an ongoing fetch for that URL
  // - Returns the result if a fetch for that URL has already been cached
  fetch = (url, onSuccess, onError = () => {}) => {
    const id = hashStr(url);

    // If we have not an ongoing request for this URL, create one
    if ( !(id in this.data) ) {
      this.data[id] = new FetchCacheElement( url );
    }

    return this.data[id].addListener(
      onSuccess,
      onError,
    );
  }

  // Sends a HEAD request to download URL header's `last-modified` value and
  // returns the comparison against saved value: `true` if new one is higher
  checkIfNeedUpdate = (url, onSuccess, onError) => {
    const id = hashStr(url);
    return this.data[id].checkIfNeedUpdate(onSuccess, onError);
  }

  // Invalidates a cache entry and recalls it's download if it has any listener
  invalidate = (url) => {
    const id = hashStr(url);
    if ( !(id in this.data) ) {
      return (new Promise(
        (resolve, reject) => {
          // Resolve without doing nothing
          // It was never downloaded
          log(`${url}: It was never downloaded`);
          resolve(true);
        }
      ))
    }
    return this.data[id].invalidate();
  }
}

// This is a singleton:
// All clients re-use the same cache
const cache = new FetchCache();
Object.freeze(cache);

export default cache;
