import React from 'react';
import { useLocation } from 'react-router-dom';

const delay = (millis) => new Promise((resolve) => setTimeout(resolve, millis));

const catchConsoleWarn = (cb, severity='warn') => {
  const output = [];
  const originalWarn = console[severity];
  const mockedWarn = jest.fn(msg => output.push(msg));
  console[severity] = mockedWarn;
  const value = cb();
  console[severity] = originalWarn;
  return {
    value,
    output,
    fn: mockedWarn,
  };
}

const catchConsoleError = (cb) => catchConsoleWarn(cb, 'error');
const catchConsoleLog = (cb) => catchConsoleWarn(cb, 'log');
const catchConsoledir = (cb) => catchConsoleWarn(cb, 'dir');

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

export {
  delay,
  createStartTouchEventObject,
  createMoveTouchEventObject,
  createEndTouchEventObject,
  LocationDisplay,
  catchConsoleWarn,
  catchConsoleError,
  catchConsoleLog,
  catchConsoledir,
};
