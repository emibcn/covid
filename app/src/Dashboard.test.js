import React from 'react';
import { render, createEvent, fireEvent, act, screen } from '@testing-library/react';
import './testSetup';
import TestRenderer from 'react-test-renderer';

import { MemoryRouter as Router } from 'react-router-dom';
import Dashboard, {Copyright, AppThemeProvider, RoutesModal} from './Dashboard';
import Menu from './Menu';

// Mock Widget/List, as this is not needed to test it here
jest.mock("./ErrorCatcher", () => {
  return {
    __esModule: true,
    default: ({origin}) => <div class='ErrorCatcher'>{ origin }</div>,
    withErrorCatcher: (name, Component) => {
      console.warn("Mocked withErrorCatcher");
      return (props) => {
        console.warn("Mocked withErrorCatcher");
        return <div class='withErrorCatcher'>{ name }: { JSON.stringify(props) }</div>;
      }
    }
  }
});

test('renders copyright link', () => {
  const { getByText } = render(<Router><Dashboard onLoadNewServiceWorkerAccept={() => {}} /></Router>);
  const copyrightElement = getByText(/Source code of/i);
  expect(copyrightElement).toBeInTheDocument();
});

test('opens about dialog on initial hash', () => {
  const dashboard = render(<Router><Dashboard onLoadNewServiceWorkerAccept={() => {}} /></Router>);
});

test('opens about dialog on initial location hash', () => {
  const dashboard = render(
    <Router initialEntries={[ '/#/#about' ]}><Dashboard onLoadNewServiceWorkerAccept={() => {}} /></Router>);
  const closeButton = screen.getByText(/ModalRouter.Close/);
  expect(closeButton).toBeInTheDocument();
});

test('opens about section', async () => {
  const modal = render(
      <Router initialEntries={[ '#/about' ]}><RoutesModal routeProps={{ language: "en-us" }} /></Router>);
  const closeButton = screen.getByText(/ModalRouter.Close/);
  expect(closeButton).toBeInTheDocument();
});

test('opens language selector', async () => {
  const modal = render(
      <Router initialEntries={[ '#/language' ]}><RoutesModal routeProps={{ language: "en-us" }} /></Router>);
  const closeButton = screen.getByText(/ModalRouter.Close/);
  expect(closeButton).toBeInTheDocument();
});

test('change drawer open state', async () => {
  // Spy on state change
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState')
  useStateSpy.mockImplementation((init) => [init, setState]);

  let drawer;
  await TestRenderer.act(async () => {
    const dashboard = await TestRenderer.create(
      <Router><Dashboard onLoadNewServiceWorkerAccept={() => {}} /></Router>);
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

