import React from 'react';
import { render, createEvent, fireEvent, act, waitFor, screen, cleanup } from '@testing-library/react';
import './testSetup';
import TestRenderer from 'react-test-renderer';

import { MemoryRouter as Router } from 'react-router-dom';

import Menu from './Menu';

test('renders closed menu, without update', () => {
  const menu = render(
    <Router>
      <Menu
        handleDrawerOpen={() => {}}
        handleDrawerClose={() => {}}
        open={false}
        newServiceWorkerDetected={false}
        onLoadNewServiceWorkerAccept={() => {}}
      />
    </Router>
  );
});

test('renders open menu, with update and update it', () => {
  const UpdateCallback = jest.fn();
  const menu = render(
    <Router>
      <Menu
        handleDrawerOpen={() => {}}
        handleDrawerClose={() => {}}
        open={true}
        newServiceWorkerDetected={true}
        onLoadNewServiceWorkerAccept={UpdateCallback}
      />
    </Router>
  );
  const elements = menu.getAllByRole('button');
  const update = elements[elements.length-1];
  fireEvent.click(update);
  expect(UpdateCallback).toHaveBeenCalledWith();
});

test('renders open menu, without update', (done) => {
  window.resizeTo(200, 200);
  // Wait for resize to take full effect (more than one event loop?)
  setTimeout( () => {
    const menu = render(
      <Router>
        <Menu
          handleDrawerOpen={() => {}}
          handleDrawerClose={() => {}}
          open={true}
          newServiceWorkerDetected={false}
          onLoadNewServiceWorkerAccept={() => {}}
        />
      </Router>
    );

    const [close,] = screen.getAllByLabelText("Menu.close menu");
    fireEvent.click(close);
    done();
  }, 1000);
});

test('renders closed menu, with update', () => {
  const menu = render(
    <Router>
      <Menu
        handleDrawerOpen={() => {}}
        handleDrawerClose={() => {}}
        open={false}
        newServiceWorkerDetected={true}
        onLoadNewServiceWorkerAccept={() => {}}
      />
    </Router>
  );
});

