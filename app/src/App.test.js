import React from 'react';
import { render, createEvent, fireEvent, act, screen } from '@testing-library/react';

import './testSetup';
import { delay } from './testHelpers';
import App, { fixLocationHash, getDefaultLanguage } from './App';

// Mock Dashboard and Widget/List, as this is not needed to test it here
jest.mock("./Dashboard", () => {
  return {
    __esModule: true,
    default: (props) => (
      <div data-testid="dashboard-mock">
        <button data-testid="dashboard-mock-fn-accept-sw" onClick={ () => props.onLoadNewServiceWorkerAccept({ detail: { registration: "tested" } }) }>
          Accept Service Worker
        </button>
        <button data-testid="dashboard-mock-fn-language-change" onClick={ () => props.onLanguageChange("tested") }>
          Change Language
        </button>
        <button data-testid="dashboard-mock-fn-theme-change" onClick={ () => props.onThemeChange("tested") }>
          Change Theme
        </button>
        <button data-testid="dashboard-mock-fn-tutorial-seen" onClick={ () => props.onTutorialSeen("tested") }>
          Tutorial Seen
        </button>

        <div data-testid="dashboard-mock-sw-detected">
          { JSON.stringify(props.newServiceWorkerDetected) }
        </div>
        <div data-testid="dashboard-mock-language">
          { JSON.stringify(props.language) }
        </div>
        <div data-testid="dashboard-mock-theme">
          { JSON.stringify(props.theme) }
        </div>
        <div data-testid="dashboard-mock-tutorial-seen">
          { JSON.stringify(props.tutorialSeen) }
        </div>
      </div>
    ),
  };
});

jest.mock("./Widget", () => {
  return {
    __esModule: true,
    WidgetsList: () => <div>WidgetsList</div>,
  };
});

// Mock available languages
jest.mock("./i18n/available", () => {
  return {
    __esModule: true,
    default: [
      { key: "tested", label: "Tested", value: {locale: "en-en"} },
      { key: "ca-es", label: "Tested ca-es", value: {locale: "ca-es"} },
      { key: "es-es", label: "Tested es-es", value: {locale: "es-es"} },
    ],
  };
});

test('fixes location hash', () => {
  window.location.hash = '#/%23/';
  fixLocationHash();
  expect(window.location.hash).toBe('#/#/');
});

test('uses default language `ca-es` when navigator language is unknown', () => {
  expect(getDefaultLanguage([])).toBe('ca-es');
});

test('detects navigator language', () => {
  const languageGetter = jest.spyOn(window.navigator, 'language', 'get');
  languageGetter.mockReturnValue('es-ES');
  expect(getDefaultLanguage([{key: 'es-es'}])).toBe('es-es');
});

test('detects new service worker', async () => {
  let app;
  act( () => {
    app = render(<App onLoadNewServiceWorkerAccept={()=>{}} />);
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

test('renders mocked dashboard', () => {
  const app = render(<App onLoadNewServiceWorkerAccept={() => {}} />);
  const element = app.getByTestId("dashboard-mock");
  expect(element).toBeInTheDocument();
});

test('detects new service worker acceptance', async () => {
  const onLoadNewServiceWorkerAccept = jest.fn();
  let app;
  act(() => {
    app = render(<App onLoadNewServiceWorkerAccept={ onLoadNewServiceWorkerAccept } />);
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
    await delay(0);

    expect(onLoadNewServiceWorkerAccept).toHaveBeenCalledTimes(1);
    expect(onLoadNewServiceWorkerAccept).toHaveBeenCalledWith("tested");
  });
});

test('detects user changed language', async () => {
  let app;
  act(() => {
    app = render(<App onLoadNewServiceWorkerAccept={() => {}} />);
  });

  await act( async () => {
    // User selects a language
    const button = app.getByTestId("dashboard-mock-fn-language-change");
    expect(button).toBeInTheDocument();
    fireEvent.click(button);

    // Execute events block in current event loop
    await delay(0);

    const status = app.getByTestId("dashboard-mock-language");
    expect(status).toHaveTextContent("tested");
  });
});

test('detects user changed theme', async () => {
  let app;
  act(() => {
    app = render(<App onLoadNewServiceWorkerAccept={() => {}} />);
  });

  await act( async () => {
    // User selects a theme
    const button = app.getByTestId("dashboard-mock-fn-theme-change");
    expect(button).toBeInTheDocument();
    fireEvent.click(button);

    // Execute events block in current event loop
    await delay(0);

    const status = app.getByTestId("dashboard-mock-theme");
    expect(status).toHaveTextContent("tested");
  });
});

test('detects user visited tutorial', async () => {
  let app;
  act(() => {
    app = render(<App onLoadNewServiceWorkerAccept={() => {}} />);
  });

  await act( async () => {
    // User selects a theme
    const button = app.getByTestId("dashboard-mock-fn-tutorial-seen");
    expect(button).toBeInTheDocument();
    fireEvent.click(button);

    // Execute events block in current event loop
    await delay(0);

    const status = app.getByTestId("dashboard-mock-tutorial-seen");
    expect(status).toHaveTextContent("tested");
  });
});
