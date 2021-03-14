import React from 'react';

// Reference: https://developers.google.com/web/tools/workbox/guides/advanced-recipes
//
// Callback to call when user accepts loading new service worker
// - Send message to SW to trigger the update
// - Once the SW has been updated, reload this window to load new assets
const updateSW = (registration, message) => {

  // `waiting` is the newly detected SW
  if( registration.waiting ) {

    // When the user asks to refresh the UI, we'll need to reload the window
    // Register an event to controllerchange, wich will be fired when the
    // `waiting` SW executes `skipWaiting`
    let preventDevToolsReloadLoop;
    navigator.serviceWorker.addEventListener('controllerchange', (event) => {

      // Ensure refresh is only called once.
      // This works around a bug in "force update on reload".
      if (preventDevToolsReloadLoop) {
        return;
      }

      preventDevToolsReloadLoop = true;
      console.log('Controller loaded');

      // Finally, refresh the page
      global.location.reload(true);
    });

    // Send a message to the new serviceWorker to activate itself
    // by executing its own `skipWaiting` method
    // The SW must register an event listener to messages which
    // identifies this `message` and runs its `skipWaiting` method
    registration.waiting.postMessage(message);
  }
}

/*
 * HOC to generate a Wrapper component which
 * will add to the WrappedComponent the next props:
 * - newServiceWorkerDetected: boolean - True when a new service
 *   worker has been detected
 * - onLoadNewServiceWorkerAccept: function - callback to execute
 *   when the user accepts to load the new service worker (and,
 *   maybe, after saving all data): page will be reloaded
 *
 * HOC Parameters:
 * - WrappedComponent: The React component to wrap
 * - message: default: `{type: 'SKIP_WAITING'}` (standard for CRA and others):
 *   the message to send to the SW to fire the `skipWaiting` service worker method
 */
const withServiceWorkerUpdater = (WrappedComponent, message={type: 'SKIP_WAITING'}) => {

  const SWUpdater = ({forwardedRef, ...props}) => {

    // States managed by this component:
    // - registration: received from event listener registered in index on SW registration
    // - newServiceWorkerDetected: wether a new SW has been detected
    const [registration, setRegistration] = React.useState(false);
    const [newServiceWorkerDetected, setNewServiceWorkerDetected] = React.useState(false);

    // Callback to execute when user accepts the update
    const handleLoadNewServiceWorkerAccept = () => {
      updateSW(registration, message);
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

    // Render the WrappedComponent with:
    // - All passed props
    // - This HOC's added props
    // - Respecting refs
    return <WrappedComponent
      {...props}
      ref={ forwardedRef }
      newServiceWorkerDetected={ newServiceWorkerDetected }
      onLoadNewServiceWorkerAccept={ handleLoadNewServiceWorkerAccept }
    />;
  }

  // Return wrapper respecting ref
  return React.forwardRef(
    (props, ref) => <SWUpdater { ...props } forwardedRef={ ref } />
  );
}

export default withServiceWorkerUpdater;
