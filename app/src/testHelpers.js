import React from 'react';
import { useLocation } from 'react-router-dom';

const delay = (millis) => new Promise((resolve) => setTimeout(resolve, millis));

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
};
