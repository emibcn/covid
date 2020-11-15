import {
  delay,
  catchConsoleLog,
  catchConsoleWarn,
  catchConsoleError
} from '../../testHelpers';

import GHPages from './GHPages';

/*
  TODO:
   - Test `scheduleNextUpdate` with recursive
   - Test `scheduleNextUpdate` with no need to update (`mockCacheSuccessValue = false`)
   - Test `millisToNextUpdate` with an extra day timelapse (`officialUpdateTime` on today, but earlier than now)
*/
const mockDelay = delay;
let mockCacheSuccess = true;
let mockCacheSuccessValue = true;
let mockCacheErrorValue = new Error("Test cache checkIfNeedUpdate error");
jest.mock("./Cache", () => {
  return {
    __esModule: true,
    default: {
      invalidate: jest.fn( async (url) => {
        await mockDelay(10);
      }),
      checkIfNeedUpdate: jest.fn( async (url, onSuccess, onError) => {
        await mockDelay(10);
        if (mockCacheSuccess) {
          await onSuccess(mockCacheSuccessValue);
        }
        else {
          onError(mockCacheErrorValue);
        }
      }),
    },
  }
});

class TestGHPages extends GHPages {
  indexUrl = 'testIndex';

  // Invalidate all URLs, except index
  invalidateAll = jest.fn(async () => {
    await delay(10);
  });
}

test('GHPages correctly checks for updates', async () => {
  const testGHPages = new TestGHPages();
  const onSuccess = jest.fn();
  const onError = jest.fn();

  // Test success with update needed
  const {output: outputSuccess} = await catchConsoleLog( async () => {
    await testGHPages.checkUpdate(onSuccess, onError);
  });
  expect(onSuccess).toHaveBeenCalledTimes(1);
  expect(onError).toHaveBeenCalledTimes(0);
  expect(onSuccess).toHaveBeenCalledWith(mockCacheSuccessValue);
  expect(outputSuccess[0].includes("update needed")).toBe(true);

  // Test error
  mockCacheSuccess = false;
  const {output: outputError} = await catchConsoleError( async () => {
    await testGHPages.checkUpdate(onSuccess, onError);
  });
  expect(onSuccess).toHaveBeenCalledTimes(1);
  expect(onError).toHaveBeenCalledTimes(1);
  expect(outputError[1].includes("Test cache checkIfNeedUpdate error")).toBe(true);
  mockCacheSuccess = true;
});

test('GHPages correctly warns about the need to overload `invalidateAll`', async () => {
  const testGHPages = new GHPages();
  const {output} = await catchConsoleWarn( async () => {
    await testGHPages.invalidateAll();
  });
  expect(output[0].includes("abstract function")).toBe(true);
});

test('GHPages correctly updates all own URLs', async () => {
  const testGHPages = new TestGHPages();
  const callback = jest.fn();
  const {output} = await catchConsoleLog( async () => {
    await testGHPages.updateAll(callback);
  });
  expect(output[0].includes("Invalidate index")).toBe(true);
  expect(testGHPages.invalidateAll).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledTimes(1);
});

test('GHPages correctly updates all own URLs, if needed', async () => {
  const testGHPages = new TestGHPages();
  const callback = jest.fn();

  // Test no need to update
  mockCacheSuccessValue = false;
  const {output} = await catchConsoleLog( async () => {
    await testGHPages.updateIfNeeded(callback);
  });
  expect(output[0].includes("update needed: false")).toBe(true);
  expect(testGHPages.invalidateAll).toHaveBeenCalledTimes(0);
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(false);
  mockCacheSuccessValue = true;

  // Test need to update
  const {output: output2} = await catchConsoleLog( async () => {
    await testGHPages.updateIfNeeded(callback);
  });
  expect(output2[0].includes("update needed: true")).toBe(true);
  expect(testGHPages.invalidateAll).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledTimes(2);
  expect(callback).toHaveBeenCalledWith(true);
});

test('GHPages correctly schedules next update loop', async () => {
  const testGHPages = new TestGHPages();
  const nowPlus2Minutes = new Date();
  nowPlus2Minutes.setMinutes(nowPlus2Minutes.getMinutes() + 2);
  testGHPages.officialUpdateTime = [
    nowPlus2Minutes.getHours(),
    nowPlus2Minutes.getMinutes()
  ];
  // Prepend '0' to minutes if it's smaller than 10
  const expectedTimeString = `${testGHPages.officialUpdateTime[0]}:${testGHPages.officialUpdateTime[1] < 10 ? '0' : ''}${testGHPages.officialUpdateTime[1]}`;

  // First try: update on mocked schedule
  const {output} = await catchConsoleLog( async () => {
    await testGHPages.scheduleNextUpdate();
  });
  expect(output[0].includes("Next update on")).toBe(true);
  expect(output[0].includes(expectedTimeString)).toBe(true);
  expect(testGHPages.invalidateAll).toHaveBeenCalledTimes(0);

  // Second try: update on `nextMillis` millisecond
  const nextMillis = 20;
  const {output: output2} = await catchConsoleLog( async () => {
    await testGHPages.scheduleNextUpdate(nextMillis);
  });
  expect(output2[0].includes("Next update on")).toBe(true);
  expect(testGHPages.invalidateAll).toHaveBeenCalledTimes(0);

  const checkUpdateOld = testGHPages.checkUpdate;
  testGHPages.checkUpdate = jest.fn( async (...args) => {
    // Silence output
    await catchConsoleLog( async () => {
      await checkUpdateOld.bind(testGHPages)(...args);
    });
  });

  await delay(nextMillis*2);

  expect(testGHPages.invalidateAll).toHaveBeenCalledTimes(1);
});
