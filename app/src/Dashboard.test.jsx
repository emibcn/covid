import React from 'react';
import { render, createEvent, fireEvent, act, waitFor, screen, cleanup } from '@testing-library/react';

import './testSetup';
import { delay } from './testHelpers';

import { MemoryRouter as Router } from 'react-router-dom';
import Dashboard from './Dashboard';

// Mock @material-ui/core/AppBar to add `data-testid` attrib
jest.mock("@material-ui/core/AppBar", () => {
  return {
    __esModule: true,
    default: ({children, className}) => (
      <div
        className={className}
        data-testid="app-bar"
      >
        { children }
      </div>
    ),
  };
});

// Mock ./Menu to test Dashboard's inline setOpen functions
jest.mock("./Menu", () => {
  return {
    __esModule: true,
    default: (props) => (
      <div data-testid="menu-mock">
        <button data-testid="menu-mock-open" onClick={ props.handleDrawerOpen }>
          Open
        </button>
        <button data-testid="menu-mock-close" onClick={ props.handleDrawerClose }>
          Close
        </button>
        <div data-testid="menu-mock-status">
          { props.open ? "Opened" : "Closed" }
        </div>
      </div>
    ),
  };
});

// Mock ./About
jest.mock("./About", () => {
  return {
    __esModule: true,
    default: (props) => <div data-testid="mock-about">About</div>,
  };
});

// Mock ServiceWorker Updater HOC
jest.mock("@3m1/service-worker-updater", () => {
  return {
    __esModule: true,
    withServiceWorkerUpdater: (Wrapped) => Wrapped,
  };
});

const objectCreator = ({initial, ...props}) => (
  <Router initialEntries={ initial }>
    <Dashboard { ...props } />
  </Router>
);

test('renders copyright link', () => {
  const { getByText } = render( objectCreator({
    newServiceWorkerDetected: false,
    onLoadNewServiceWorkerAccept: () => {},
  }));

  const copyrightElement = getByText(/Source code of/i);
  expect(copyrightElement).toBeInTheDocument();
});

test('renders closed AppBar', () => {
  const dashboard = render( objectCreator({
    newServiceWorkerDetected: false,
    onLoadNewServiceWorkerAccept: () => {},
  }));

  const appBar = dashboard.getByTestId('app-bar');

  // Test computed style to NOT have marginLeft
  const styles = window.getComputedStyle(appBar);
  expect(styles.marginLeft).not.toBe('240px');

  // Test assigned class with clsx
  const foundKlass = [...appBar.classList]
    .find( klass => /^makeStyles-appBar-/.test(klass));
  expect(foundKlass).toBeTruthy();
  expect(appBar.classList.contains(foundKlass)).toBe(true);
});

test('alerts user when new service worker is detected', async () => {
  let dashboard;
  // Badge not visible in big screens
  act( () => {
    dashboard = render( objectCreator({
      newServiceWorkerDetected: true,
      onLoadNewServiceWorkerAccept: () => {},
    }));

    const updateElement = dashboard.getByText('1'); // Detect menu badge
    expect(updateElement.classList.contains('MuiBadge-invisible')).toBe(true);
  });

  await act( async () => {
    window.resizeTo(400, 200);

    // Wait for resize to take full effect (more than one event loop?)
    await delay(0);

    // Rerender with new sizes
    dashboard.rerender( objectCreator({
      newServiceWorkerDetected: true,
      onLoadNewServiceWorkerAccept: () => {},
    }));

    const updateElement = dashboard.getByText('1'); // Detect menu badge
    expect(updateElement.classList.contains('MuiBadge-invisible')).toBe(false);
  });
});

test('opens about dialog on initial location hash', () => {
  const dashboard = render( objectCreator({
    initial: [ '#about' ],
    newServiceWorkerDetected: false,
    onLoadNewServiceWorkerAccept: () => {},
  }));

  const closeButton = screen.getByText(/ModalRouter.Close/);
  expect(closeButton).toBeInTheDocument();
});

test('change drawer open state', async () => {
  // Spy on state change
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState')
  useStateSpy.mockImplementation((init) => [init, setState]);

  let dashboard;
  await act(async () => {
    dashboard = await render( objectCreator({
      newServiceWorkerDetected: false,
      onLoadNewServiceWorkerAccept: () => {},
    }));

    const status = dashboard.getByTestId("menu-mock-status");;
    expect(status).toHaveTextContent("Closed");
  });

  await act(async () => {
    const open = dashboard.getByTestId("menu-mock-open");
    fireEvent.click(open);
    expect(setState).toHaveBeenCalledWith(true);
  });

  await act(async () => {
    const close = dashboard.getByTestId("menu-mock-close");
    fireEvent.click(close);
    expect(setState).toHaveBeenCalledWith(false);
  });
});

test('render initially opened drawer', async () => {
  // Spy on state change
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState')
  useStateSpy.mockImplementation((init) => [true, setState]);

  const dashboard = await render( objectCreator({
    newServiceWorkerDetected: false,
    onLoadNewServiceWorkerAccept: () => {},
  }));

  const status = dashboard.getByTestId("menu-mock-status");;
  expect(status).toHaveTextContent("Opened");
});
