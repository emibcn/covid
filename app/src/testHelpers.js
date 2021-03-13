import React from 'react';
import { useLocation } from 'react-router-dom';

const delay = (millis) => new Promise((resolve) => setTimeout(resolve, millis));

const catchConsoleWarn = async (cb, severity='warn') => {
  const output = [];
  const originalWarn = console[severity];
  const mockedWarn = jest.fn((msg, ...rest) => {
    output.push(msg);
    if (rest) {
      output.push(`${rest}`);
    }
  });
  console[severity] = mockedWarn;
  const value = await cb();
  console[severity] = originalWarn;
  return {
    value,
    output,
    fn: mockedWarn,
  };
}

const catchConsoleError = async (cb) => await catchConsoleWarn(cb, 'error');
const catchConsoleLog = async (cb) => await catchConsoleWarn(cb, 'log');
const catchConsoleDir = async (cb) => await catchConsoleWarn(cb, 'dir');

const createClientXY = (x, y) => ({
  clientX: x,
  clientY: y,
  pageX: x,
  pageY: y,
});
const createStartTouchEventObject = ({ x = 0, y = 0 }) => ({
  touches: [createClientXY(x, y)]
});
const createMoveTouchEventObject = (coords) => ({
  touches: coords.map(({ x = 0, y = 0}) => createClientXY(x, y)),
  changedTouches: coords.map(({ x = 0, y = 0}) => createClientXY(x, y)),
});
const createEndTouchEventObject = ({ x = 0, y = 0}) => ({
  touches: [createClientXY(x, y)],
  changedTouches: [createClientXY(x, y)]
});

// Testing components
const LocationDisplay = ({member='hash'}) => {
  const location = useLocation()
  return (
    <div data-testid="location-display">
      { location[member] }
    </div>
  )
}

// Helper to mock and test fetch
class MockFetch {
  original = null;
  options = {
    date: new Date(),
    throwError: false,
    responseOptions: () => ({
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'last-modified': this.options.date.toString(),
      }
    }),
  }

  mock = () => {
    // Mock fetch
    if (this.original === null) {
      this.original = global.fetch;
      global.fetch = jest.fn( async (url, options) => {
        await delay(500);
        if (this.options.throwError !== false) {
          throw this.options.throwError;
        }
        try {
          return new Response(
            JSON.stringify({tested: true, url}),
            this.options.responseOptions.bind(this)()
          );
        } catch(err) {
          console.error("MOCKED FETCH ERROR:", err);
          throw err;
        }
      });
    }
  }

  unmock = () => {
    // Unmock fetch
    global.fetch = this.original;
    this.original = null;
  }
}

class AbortError extends Error {
  constructor(...args) {
    super(...args);
    this.name = "AbortError";
  }
}

export {
  delay,
  createStartTouchEventObject,
  createMoveTouchEventObject,
  createEndTouchEventObject,
  LocationDisplay,
  catchConsoleWarn,
  catchConsoleError,
  catchConsoleLog,
  catchConsoleDir,
  MockFetch,
  AbortError,
};
