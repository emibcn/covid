import { delay } from './testHelpers';
import Throtle from './Throtle';

test('does not executes more than once per timeout', async () => {
  const throtler = new Throtle();
  const cb = jest.fn();
  throtler.start(100);
  throtler.run(false, 100, cb);

  // Should not execute: not due yet
  await delay(50);
  throtler.run(false, 100, cb);
  expect(cb).toHaveBeenCalledTimes(0);

  // Should execute: enough time passed
  await delay(51);
  throtler.run(false, 100, cb);
  expect(cb).toHaveBeenCalledTimes(1);

  // Should not execute: not due yet
  throtler.run(false, 100, cb);
  expect(cb).toHaveBeenCalledTimes(1);

  // Should execute: forced
  throtler.run(true, 100, cb);
  expect(cb).toHaveBeenCalledTimes(2);

  // Should not execute: not due yet
  throtler.run(false, 100, cb);
  expect(cb).toHaveBeenCalledTimes(2);

  // Should execute: cleared
  throtler.clear();
  throtler.run(false, 100, cb);
  expect(cb).toHaveBeenCalledTimes(3);

  // Should not execute: not due yet
  throtler.run(false, 100, cb);
  expect(cb).toHaveBeenCalledTimes(3);

  // Cleanup
  const timer1 = throtler.timer;
  throtler.clear();
  const timer2 = throtler.timer;
  throtler.clear();
  const timer3 = throtler.timer;

  expect(timer1).not.toBe(timer2);
  expect(timer2).toBe(timer3);
  expect(timer3).toBe(false);
});
