import React from 'react';
import { render, createEvent, fireEvent, act, waitFor, screen, cleanup } from '@testing-library/react';
import TestRenderer from 'react-test-renderer';

import './testSetup';
import { delay } from './testHelpers';

import { MemoryRouter as Router } from 'react-router-dom';
import Dashboard, { Copyright } from './Dashboard';
import Menu from './Menu';

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
  // Badge not visible in big s reens
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

// TODO: Stop using TestRenderer. Mock Drawer?
test('change drawer open state', async () => {
  // Spy on state change
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState')
  useStateSpy.mockImplementation((init) => [init, setState]);

  let drawer;
  await TestRenderer.act(async () => {
    const dashboard = await TestRenderer.create( objectCreator({
      newServiceWorkerDetected: false,
      onLoadNewServiceWorkerAccept: () => {},
    }));

    const instance = dashboard.root;
    drawer = instance.findByType(Menu);
  });

  await TestRenderer.act(async () => {
    await drawer.props.handleDrawerOpen();
    expect(setState).toHaveBeenCalledWith(true);
  });

  await TestRenderer.act(async () => {
    await drawer.props.handleDrawerClose();
    expect(setState).toHaveBeenCalledWith(false);
  });
});

test('render opened drawer', async () => {
  // Spy on state change
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState')
  useStateSpy.mockImplementation((init) => [true, setState]);

  const dashboard = await render( objectCreator({
    newServiceWorkerDetected: false,
    onLoadNewServiceWorkerAccept: () => {},
  }));
});
