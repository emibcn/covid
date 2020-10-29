import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import { render, createEvent, fireEvent, act, screen } from '@testing-library/react';
import './testSetup';

import ModalRouterWithRoutes from './ModalRouterWithRoutes';

test('opens none section', async () => {
  const modal = render(
    <Router initialEntries={[ '#/none' ]}><ModalRouterWithRoutes routeProps={{ language: "en-us" }} /></Router>);
  // TODO: Needs to fail
  //  - Need to find the element and be ok not finding it (and it does not)
  //  - If found, test should fail (and it does not)
  const closeButton = screen.getByText(/ModalRouter.Close/);
  expect(closeButton).toBeInTheDocument();
  screen.debug();
});

test('opens about section', async () => {
  const modal = render(
    <Router initialEntries={[ '#/about' ]}><ModalRouterWithRoutes routeProps={{ language: "en-us" }} /></Router>);
  const closeButton = screen.getByText(/ModalRouter.Close/);
  expect(closeButton).toBeInTheDocument();
  screen.debug();
});

test('opens language selector', async () => {
  const modal = render(
    <Router initialEntries={[ '#/language' ]}><ModalRouterWithRoutes routeProps={{ language: "en-us" }} /></Router>);
  const closeButton = screen.getByText(/ModalRouter.Close/);
  expect(closeButton).toBeInTheDocument();
});

