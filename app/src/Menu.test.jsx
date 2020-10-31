import React from 'react';
import { render, createEvent, fireEvent, act, waitFor, screen, cleanup } from '@testing-library/react';
import './testSetup';
import {
  delay,
  createStartTouchEventObject,
  createMoveTouchEventObject,
  createEndTouchEventObject
} from './testHelpers';
import TestRenderer from 'react-test-renderer';

import { MemoryRouter as Router } from 'react-router-dom';

import Menu from './Menu';

// Mock HTML elements' clientWidth/clientHeight
Element.prototype.getBoundingClientRect = jest.fn(() => ({
  width: 200,
  height: 20,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
}));
Object.defineProperty(Element.prototype, 'clientWidth', {
  get: jest.fn(() => 200),
});
Object.defineProperty(Element.prototype, 'clientHeight', {
  get: jest.fn(() => 200),
});

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

  const title = menu.getByText("Menu.Menu");
  expect(title).toBeInTheDocument();
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

test('renders open menu, without update (small screen)', async () => {
  await act( async () => {
    window.resizeTo(200, 200);
    // Wait for resize to take full effect (more than one event loop?)
    await delay(50);
  });

  await act( async () => {
    const CloseCallback = jest.fn();
    const menu = render(
      <Router>
        <Menu
          handleDrawerOpen={() => {}}
          handleDrawerClose={CloseCallback}
          open={true}
          newServiceWorkerDetected={false}
          onLoadNewServiceWorkerAccept={() => {}}
        />
      </Router>
    );

    await delay(50);

    const [close,] = screen.getAllByLabelText("Menu.close menu");
    fireEvent.click(close);
    expect(CloseCallback).toHaveBeenCalled();
  });
});

test('renders closed menu, with update (small screen), swipe to open', async () => {
  const touches = [
    { x:   0, y: 100 },
    { x:  30, y: 100 },
    { x:  55, y: 100 },
    { x: 150, y: 100 },
    { x: 200, y: 100 },
  ];

  await act( async () => {
    window.resizeTo(200, 200)
    await delay(50);
  });

  const OpenCallback = jest.fn();
  let menu;
  let swipeDetector;
  await act( async () => {
    menu = render(
      <Router>
        <Menu
          handleDrawerOpen={OpenCallback}
          handleDrawerClose={() => {}}
          open={false}
          newServiceWorkerDetected={true}
          onLoadNewServiceWorkerAccept={() => {}}
        />
      </Router>
    );

    await delay(50);
    swipeDetector = menu.container.children[0];

    // Menu is hidden/not drawn
    expect(
      () => screen.getByText("Menu.Menu")
    ).toThrowError(/Unable to find an element/);
  });

  // Swipe to open it
  await act( async () => {
    fireEvent.touchStart(swipeDetector, createStartTouchEventObject(
      touches[0]
    ));
  });
  await act( async () => {
    await delay(50);
    fireEvent.touchMove(swipeDetector, createMoveTouchEventObject(
      touches.filter( (t, index) => index > 0)
    ));
  });
  await act( async () => {
    await delay(50);

    // While swiping, menu is shown in the document
    const title = screen.getByText("Menu.Menu");
    expect(title).toBeInTheDocument();

    // End swiping
    fireEvent.touchEnd(swipeDetector, createEndTouchEventObject(
      touches[ touches.length - 1 ]
    ));
  });

  await act( async () => {
    await delay(50);
    expect(OpenCallback).toHaveBeenCalled();
  });

  // Menu only will finally be shown when we pass props.open = true
});

test('renders opened menu, with update (small screen), click backdrop to close', async () => {

  await act( async () => {
    window.resizeTo(200, 200)
    await delay(50);
  });

  const CloseCallback = jest.fn();
  let menu;
  let backdrop;
  await act( async () => {
    menu = render(
      <Router>
        <Menu
          handleDrawerOpen={() => {}}
          handleDrawerClose={CloseCallback}
          open={true}
          newServiceWorkerDetected={true}
          onLoadNewServiceWorkerAccept={() => {}}
        />
      </Router>
    );

    await delay(50);
    backdrop = menu.container.children[0].children[0];
  });

  await act( async () => {
    fireEvent.click(backdrop);
  });

  await act( async () => {
    await delay(50);
    expect(CloseCallback).toHaveBeenCalled();
  });
});

test('renders opened menu, with update (small screen), close with Escape key on backdrop', async () => {

  await act( async () => {
    window.resizeTo(200, 200)
    await delay(50);
  });

  const CloseCallback = jest.fn();
  let menu;
  let backdrop;
  await act( async () => {
    menu = render(
      <Router>
        <Menu
          handleDrawerOpen={() => {}}
          handleDrawerClose={CloseCallback}
          open={true}
          newServiceWorkerDetected={true}
          onLoadNewServiceWorkerAccept={() => {}}
        />
      </Router>
    );

    await delay(50);
    backdrop = menu.container.children[0].children[0];
  });

  await act( async () => {
    fireEvent.keyDown(backdrop, {
      key: 'Escape',
    });
    await delay(50);
  });

  await act( async () => {
    await delay(50);
    expect(CloseCallback).toHaveBeenCalled();
  });
});

// TODO: Test Component differences for isBig and iOS
