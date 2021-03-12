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
        <button data-testid="dashboard-mock-fn-language-change" onClick={ () => props.onLanguageChange("tested") }>
          Change Language
        </button>
        <button data-testid="dashboard-mock-fn-theme-change" onClick={ () => props.onThemeChange("tested") }>
          Change Theme
        </button>
        <button data-testid="dashboard-mock-fn-tutorial-seen" onClick={ () => props.onTutorialSeen("tested") }>
          Tutorial Seen
        </button>

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

jest.mock("./Backend", () => {
  return {
    __esModule: true,
    BackendProvider: ({children}) => <>{children}</>,
    IndexesHandler: ({children}) => <>{children}</>,
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

test('renders mocked dashboard', () => {
  const app = render(<App />);
  const element = app.getByTestId("dashboard-mock");
  expect(element).toBeInTheDocument();
});

test('detects user changed language', async () => {
  let app;
  act(() => {
    app = render(<App />);
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
    app = render(<App />);
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
    app = render(<App />);
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
