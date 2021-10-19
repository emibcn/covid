import React from "react";
import {
  render,
  createEvent,
  fireEvent,
  act,
  waitFor,
  screen,
  cleanup,
} from "@testing-library/react";

import { MemoryRouter as Router, Route } from "react-router-dom";

import "./testSetup";
import { delay, LocationDisplay } from "./testHelpers";
import ModalRouter from "./ModalRouter";

test("renders ModalRouter and close by clicking the button", async () => {
  const routeId = "test-route";
  const routePath = `${routeId}`;

  let modal;
  await act(async () => {
    modal = render(
      <Router initialEntries={[`/#${routeId}`]}>
        <ModalRouter force={false}>
          <Route
            exact
            path={routePath}
            render={(props) => <div data-testid={routeId} />}
          />
        </ModalRouter>
        <LocationDisplay />
      </Router>
    );

    await delay(0);

    // Dialog is open
    const dialog = modal.container.querySelector('[role="dialog"]');
    expect(dialog).toBeInTheDocument();

    // Our Route has been rendered
    const route = modal.getByTestId(routeId);
    expect(route).toBeInTheDocument();
  });

  await act(async () => {
    const close = modal.container.querySelector(".MuiButtonBase-root");
    fireEvent.click(close);

    // Our route will disappear in 10 millis
    const route = modal.getByTestId(routeId);
    expect(route).toBeInTheDocument();

    await delay(250);

    // Our route should have been already hidden
    expect(() => modal.getByTestId(routeId)).toThrowError(
      /Unable to find an element/
    );
    const location = modal.getByTestId("location-display");

    // MemoryRoute should be ''
    expect(location).toHaveTextContent("");
  });
});

test('renders ModalRouter with auto-close by initially forcing to "/"', async () => {
  const routeId = "test-route";
  const routePath = `${routeId}`;
  const menuObj = (force = false) => (
    <Router initialEntries={[`/#${routeId}`]}>
      <ModalRouter force={force}>
        <Route
          exact
          path={routePath}
          render={(props) => <div data-testid={routeId} />}
        />
      </ModalRouter>
      <LocationDisplay />
    </Router>
  );

  let modal;
  await act(async () => {
    modal = render(menuObj(""));

    // Dialog is NOT open in first event loop
    expect(modal.container.querySelector('[role="dialog"]')).toBe(null);

    // Await background jobs
    await delay(0);

    // Dialog is NOT open after first event loop
    expect(modal.container.querySelector('[role="dialog"]')).toBe(null);
  });
});

test('renders ModalRouter with auto-close by forcing to "/"', async () => {
  const routeId = "test-route";
  const menuObj = (force = false) => (
    <Router initialEntries={[`/#${routeId}`]}>
      <ModalRouter force={force}>
        <Route
          exact
          path={routeId}
          render={(props) => <div data-testid={routeId} />}
        />
      </ModalRouter>
      <LocationDisplay />
    </Router>
  );

  let modal;
  await act(async () => {
    modal = render(menuObj());

    // Dialog is NOT open in first event loop
    expect(modal.container.querySelector('[role="dialog"]')).toBe(null);

    // Await background jobs
    await delay(0);

    // Dialog is now in the document
    const dialog = modal.container.querySelector('[role="dialog"]');
    expect(dialog).toBeInTheDocument();
  });

  await act(async () => {
    modal.rerender(menuObj(""));
    await delay(0);

    // Dialog is NOT open
    expect(modal.container.querySelector('[role="dialog"]')).toBe(null);
  });
});

test("renders ModalRouter with with force and autoforce: visit initialEntries after forced one has been dismissed", async () => {
  const routeId = "test-route";
  const routeId2 = "test-route-2";
  const menuObj = (initial = "", force = false) => (
    <Router initialEntries={[`/#${initial}`]}>
      <ModalRouter force={force}>
        <Route
          exact
          path={routeId}
          render={(props) => <div data-testid={routeId} />}
        />
        <Route
          exact
          path={routeId2}
          render={(props) => <div data-testid={routeId2} />}
        />
      </ModalRouter>
      <LocationDisplay />
    </Router>
  );

  let modal;
  await act(async () => {
    modal = render(menuObj(routeId, routeId2));

    // Dialog is NOT open in first event loop
    expect(modal.container.querySelector('[role="dialog"]')).toBe(null);

    // Await background jobs
    await delay(0);

    // Dialog is now in the document
    const dialog = modal.container.querySelector('[role="dialog"]');
    expect(dialog).toBeInTheDocument();
  });

  await act(async () => {
    const close = modal.container.querySelector(".MuiButtonBase-root");
    fireEvent.click(close);

    await delay(0);
    await delay(250);

    // Our route should have been already hidden
    const routed = modal.getByTestId(routeId);
    expect(routed).toBeInTheDocument();
    const location = modal.getByTestId("location-display");

    // MemoryRoute should be `#${routeId2}`
    expect(location).toHaveTextContent(`#${routeId}`);
  });
});

test("clears timer on unmount, do not creates more than 1 simultaneous timer, ", async () => {
  const routeId = "test-route";
  const menuObj = (force = false) => (
    <Router initialEntries={[`/#${routeId}`]}>
      <ModalRouter force={force}>
        <Route
          exact
          path={routeId}
          render={(props) => <div data-testid={routeId} />}
        />
      </ModalRouter>
      <LocationDisplay />
    </Router>
  );

  // Mock setTimeout to count how many times it have been called
  const originalSetTimeout = window.setTimeout;
  let modal;
  await act(async () => {
    modal = render(menuObj());

    // Dialog is NOT open in first event loop
    expect(modal.container.querySelector('[role="dialog"]')).toBe(null);

    // Await background jobs
    await delay(0);

    // Dialog is now in the document
    const dialog = modal.container.querySelector('[role="dialog"]');
    expect(dialog).toBeInTheDocument();
  });

  // Mock setTimeout to count calls to it and calls to it's callback
  let callbackTimeout;
  window.setTimeout = jest.fn((cb, millis) => {
    // Don't mock current test delays callbacks
    if (millis > 0) {
      callbackTimeout = jest.fn(cb);
      return originalSetTimeout(callbackTimeout, millis);
    } else {
      return originalSetTimeout(cb, millis);
    }
  });

  // Click twice to ensure no more than one timer is executed
  await act(async () => {
    const close = modal.container.querySelector(".MuiButtonBase-root");
    fireEvent.click(close);

    await delay(0);
  });

  await act(async () => {
    const close = modal.container.querySelector(".MuiButtonBase-root");
    fireEvent.click(close);

    await delay(0);

    // Unmount modal before timer is executed
    modal.unmount();

    // Timer is not executed after its due time
    await delay(50);

    // 4 = 1 for the tested component + 3 for the `delay` called here
    expect(window.setTimeout).toHaveBeenCalledTimes(5);

    // 1 for the `delay` called here
    expect(callbackTimeout).toHaveBeenCalledTimes(1);
  });

  // Undo setTimeout Mock
  window.setTimeout = originalSetTimeout;
});
