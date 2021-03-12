import React from 'react';
import { render, createEvent, fireEvent, act, waitFor, screen, cleanup } from '@testing-library/react';

import { delay } from './testHelpers';

import withServiceWorkerUpdater from './withServiceWorkerUpdater';

const SWDetector = withServiceWorkerUpdater( (props) => (
  <>
    <button
      data-testid="dashboard-mock-fn-accept-sw"
      onClick={ () => {
        props.onAccept("tested");
        props.onLoadNewServiceWorkerAccept({ detail: { registration: "tested" } })
      }}
    >
      Accept Service Worker
    </button>
    <div data-testid="dashboard-mock-sw-detected">
      { JSON.stringify(props.newServiceWorkerDetected) }
    </div>
  </>
));

test('detects new service worker', async () => {
  let app;
  act( () => {
    app = render(<SWDetector />);
  });
  await act( async () => {
    const event = new CustomEvent('onNewServiceWorker', { detail: { registration: true } });
    fireEvent(document, event);

    // Execute events block in current event loop
    await delay(0);

    const detectedNewSW = app.getByTestId("dashboard-mock-sw-detected");
    expect(detectedNewSW).toHaveTextContent("true");
  });
});

test('detects new service worker acceptance', async () => {
  const onLoadNewServiceWorkerAccept = jest.fn();
  let app;
  act(() => {
    app = render(<SWDetector onAccept={ onLoadNewServiceWorkerAccept } />);
  });

  await act( async () => {
    // Fire event for new service worker detection
    const event = new CustomEvent('onNewServiceWorker', { detail: { registration: "tested" } });
    fireEvent(document, event);

    // User accepts it
    const button = app.getByTestId("dashboard-mock-fn-accept-sw");
    expect(button).toBeInTheDocument();
    fireEvent.click(button);

    // Execute events block in current event loop
    await delay(100);

    expect(onLoadNewServiceWorkerAccept).toHaveBeenCalledTimes(1);
    expect(onLoadNewServiceWorkerAccept).toHaveBeenCalledWith("tested");
  });
});

