import React from "react";
import {
  render,
  createEvent,
  fireEvent,
  act,
  screen,
} from "@testing-library/react";

import { MemoryRouter as Router } from "react-router-dom";

import "./testSetup";
import ModalRouterWithRoutes from "./ModalRouterWithRoutes";

// Mock ErrorCatcher, as this is not needed to test it here
jest.mock("./ErrorCatcher", () => {
  return {
    __esModule: true,
    default: ({ origin }) => <div className="ErrorCatcher">{origin}</div>,
    withErrorCatcher: (name, Component) => {
      return <div className="withErrorCatcher">{name}Page</div>;
    },
  };
});

test("opens none section", async () => {
  const modal = render(
    <Router initialEntries={["#"]}>
      <ModalRouterWithRoutes routeProps={{ language: "en-us" }} />
    </Router>
  );

  // Close button should NOT be in screen
  expect(() => screen.getByText(/ModalRouter.Close/)).toThrowError(
    /Unable to find an element/
  );
});

test("opens about section", async () => {
  const modal = render(
    <Router initialEntries={["#about"]}>
      <ModalRouterWithRoutes routeProps={{ language: "en-us" }} />
    </Router>
  );

  const closeButton = screen.getByText(/ModalRouter.Close/);
  expect(closeButton).toBeInTheDocument();

  const page = screen.getByText(/AboutPage/);
  expect(page).toBeInTheDocument();
});

test("opens language selector", async () => {
  const modal = render(
    <Router initialEntries={["#language"]}>
      <ModalRouterWithRoutes routeProps={{ language: "en-us" }} />
    </Router>
  );

  const closeButton = screen.getByText(/ModalRouter.Close/);
  expect(closeButton).toBeInTheDocument();

  const page = screen.getByText(/LanguagePage/);
  expect(page).toBeInTheDocument();
});
