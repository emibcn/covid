import React from 'react';

// Callback to call when user accepts loading new service worker
// - Send message to SW to trigger the update
// - Once updated, reload this window to load new assets
const updateSW = (registration) => {
  if( registration.waiting ) {
    // When the user asks to refresh the UI, we'll need to reload the window
    let preventDevToolsReloadLoop;
    navigator.serviceWorker.addEventListener('controllerchange', (event) => {

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
    registration.waiting.postMessage({type: 'SKIP_WAITING'});
  }
};

const withServiceWorkerUpdater = (WrappedComponent) =>
  (props) => {
    const [registration, setRegistration] = React.useState(false);
    const [newServiceWorkerDetected, setNewServiceWorkerDetected] = React.useState(false);
    const handleLoadNewServiceWorkerAccept = () => {
      updateSW(registration);
    }

    // Add/remove event listeners for event thrown from `index.js`
    React.useEffect(() => {
      const handleNewServiceWorker = (event) => {
        setRegistration(event.detail.registration);
        setNewServiceWorkerDetected(true);
      }

      document.addEventListener('onNewServiceWorker', handleNewServiceWorker);
      return () => document.removeEventListener('onNewServiceWorker', handleNewServiceWorker);
    }, [setRegistration, setNewServiceWorkerDetected]);

    return <WrappedComponent
      {...props}
      newServiceWorkerDetected={ newServiceWorkerDetected }
      onLoadNewServiceWorkerAccept={ handleLoadNewServiceWorkerAccept }
    />;
  }

export default withServiceWorkerUpdater;
