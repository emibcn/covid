import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

// Callback to call when user accepts loading new service worker
// - Send message to SW to trigger the update
// - Once updated, reload this window to load new assets
const updateSW = (registration) => {
  if( registration.waiting ) {

    // When the user asks to refresh the UI, we'll need to reload the window
    var preventDevToolsReloadLoop;
    navigator.serviceWorker.addEventListener('controllerchange', function(event) {

      // Ensure refresh is only called once.
      // This works around a bug in "force update on reload".
      if (preventDevToolsReloadLoop) {
        return;
      }

      preventDevToolsReloadLoop = true;
      console.log('Controller loaded');
      global.location.reload(true);
    });

    // Send a message to the new serviceWorker to activate itself
    registration.waiting.postMessage('skipWaiting');
  }
};


// Render the App
ReactDOM.render(
  <React.StrictMode>
    <App onLoadNewServiceWorkerAccept={ updateSW } />
  </React.StrictMode>,
  document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register({

  // When new ServiceWorker is available, trigger an event on `document`,
  // passing `registration` as extra data
  onUpdate: registration => {
    var event = new CustomEvent('onNewServiceWorker', { detail: { registration } });
    document.dispatchEvent(event);
  }

});
