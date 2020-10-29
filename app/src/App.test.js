import React from 'react';
import { render, createEvent, fireEvent, act, screen } from '@testing-library/react';
import './testSetup';

import App, {fixLocationHash, getDefaultLanguage} from './App';

test('renders copyright link', () => {
  const { getByText } = render(<App onLoadNewServiceWorkerAccept={() => {}} />);
  const linkElement = getByText(/Source code of/i);
  expect(linkElement).toBeInTheDocument();
});

// Mock Widget/List, as this is not needed to test it here
jest.mock("./Widget", () => {
  return {
    __esModule: true,
    WidgetsList: () => <div>WidgetsList</div>,
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
  const languageGetter = jest.spyOn(window.navigator, 'language', 'get')
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
    const updateElement = await app.findByText('1'); // Detect menu badge
    expect(updateElement).toBeInTheDocument();
  });
});

test('translates app into detected language', async () => {
  const languageGetter = jest.spyOn(window.navigator, 'language', 'get')
  await act( async () => {
    languageGetter.mockReturnValue('en-US');
    const app = render(<App onLoadNewServiceWorkerAccept={()=>{}} />);
    const [codeElement,] = await app.findAllByText('Refactored');
    expect(codeElement).toBeInTheDocument();
    // Ensure app is fully re-created
    app.unmount();
  });
  await act( async () => {
    languageGetter.mockReturnValue('ca-ES');
    const app = render(<App onLoadNewServiceWorkerAccept={()=>{}} />);
    const [codeElement,] = await app.findAllByText('Refactoritzada');
    expect(codeElement).toBeInTheDocument();
  });
});
