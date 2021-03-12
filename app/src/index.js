import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

// Render the App
ReactDOM.render(
  <React.StrictMode>
    <App />
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
    const event = new CustomEvent('onNewServiceWorker', { detail: { registration } });
    document.dispatchEvent(event);
  }

});
