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

export {
  delay,
  createStartTouchEventObject,
  createMoveTouchEventObject,
  createEndTouchEventObject
};
