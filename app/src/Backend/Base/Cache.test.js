import cache from './Cache';

import {
  delay,
  MockFetch,
  AbortError,
  catchConsoleLog,
  catchConsoleWarn,
} from '../../testHelpers';

/*
  TODO:
   - Add test for fetch without declaring onError (throw in onSuccess and catch with expect?)
   - Count some more calls to fetch
*/

let mockedFetch = new MockFetch();
beforeAll(() => {
  mockedFetch.mock();
});

afterAll(() => {
  mockedFetch.unmock();
});

// Rethrow jest expect' errors
const onError = jest.fn((error) => { throw error });

let unsubscribe;
test('cache fetches only once for the same URL', async () => {
  const url = "test";

  // Test results
  const {output} = await catchConsoleLog( () => new Promise( (resolve) => {
    const onSuccess = (data) => {
      expect(data).toBeDefined();
      expect(data.tested).toBe(true);
      expect(window.fetch).toBeCalledTimes(1);

      // Create a controller to use its signal to shallow
      // compare against fetch' calling arguments
      const controller = new AbortController();
      expect(window.fetch).toBeCalledWith(url, {signal: controller.signal});
    };
    const onSuccess2 = (data) => {
      // Same data
      expect(data).toBeDefined();
      expect(data.tested).toBe(true);

      // No new fetch calls
      expect(window.fetch).toBeCalledTimes(1);

      // Resolve promise
      resolve();
    };

    // Launch test (act)
    const unsubs1 = cache.fetch(url, onSuccess, onError);
    const unsubs2 = cache.fetch(url, onSuccess2, onError);

    // Unsubscribe both URLs
    unsubscribe = () => {
      unsubs1();
      unsubs2();
    };
  }));

  expect(output.filter( o => o.includes("Added listener to")).length).toBe(2);
});

test('cache correctly detects if a cached URL needs to be updated', async () => {
  const url = "test";

  await cache.checkIfNeedUpdate(
    url,
    (needUpdate) => {
      expect(needUpdate).toBe(false);
    },
    onError
  );

  // No need to re-download
  const {output} = await catchConsoleLog( () => new Promise( (resolve) => {
    const unsubs = cache.fetch(url, resolve, onError);

    // Add new unsubscriber
    const oldUnsubscribe = unsubscribe;
    unsubscribe = () => {
      oldUnsubscribe();
      unsubs();
    }
  }));

  expect(output.filter( o => o.includes("Added listener to")).length).toBe(1);
});

test('cache correctly invalidates an unsubscribed URL', async () => {
  const url = "test";

  // Unsubscribe 3 URLs subscriptions
  const {output} = await catchConsoleLog( () => {
    unsubscribe();
  });

  expect(output.filter( o => o.includes("Remove listener from")).length).toBe(3);

  const {output: output2} = await catchConsoleLog( async () => {
    await cache.invalidate(url);
  });

  expect(output2[0].includes("Someone downloaded it")).toBe(true);

  mockedFetch.options.date = new Date();
  await cache.checkIfNeedUpdate(
    url,
    (needUpdate) => {
      expect(needUpdate).toBe(true);
    },
    onError
  );

  // Unsubscribe again both URLs: should throw warning
  const {output: output3} = await catchConsoleWarn( () => {
    unsubscribe();
  });

  expect(output3.filter( o => o.includes("Listener not found")).length).toBe(3);
});

test('cache correctly invalidates a subscribed URL and detects if it needs an update', async () => {
  const url = "test2";

  const {output} = await catchConsoleLog( async () => {
    await cache.invalidate(url);
  });

  expect(output[0].includes("It was never downloaded")).toBe(true);

  let unsubs;
  const {output: output2} = await catchConsoleLog( async () => new Promise(resolve => {
    unsubs = cache.fetch(url, resolve, () => {});
  }));

  expect(output2[0].includes("Added listener to")).toBe(true);

  // Mock a backend update and check if it is detected
  mockedFetch.options.date = new Date();
  await cache.checkIfNeedUpdate(
    url,
    (needUpdate) => {
      expect(needUpdate).toBe(true);
    },
    onError
  );

  // Invalidates the url. As it has one subscriber,
  // automatically downloads the new version
  const {output: output3} = await catchConsoleLog( async () => {
    await cache.invalidate(url);

    // Test double invalidation protection
    const {output: outputInternal} = await catchConsoleLog( async () => {
      await cache.invalidate(url);
    });
    expect(outputInternal[0].includes("It has already been invalidated")).toBe(true);
  });

  expect(output3[0].includes("Fetch it!")).toBe(true);

  // With invalidation, the new version is downloaded,
  // so it is no needed to update it again
  await (new Promise(resolve => {
    cache.checkIfNeedUpdate(
      url,
      (needUpdate) => {
        expect(needUpdate).toBe(false);
        resolve();
      },
      onError
    );
  }));

  // Silence log
  await catchConsoleLog( unsubs );
});

test('cache fetch (no wait) -> unsubscribe (with abort) -> invalidate (never downloaded)', async () => {
  const url = "test3";

  const {output} = await catchConsoleLog( async () => {
    const unsubs = cache.fetch( url, () => {}, onError);
    unsubs();
  });

  expect(output[0].includes("Added listener to")).toBe(true);

  // It started the download, but never finished it (aborted with `unsubs`)
  const {output: output2} = await catchConsoleLog( async () => {
    await cache.invalidate(url);
  });

  expect(output2[0].includes("It was never downloaded")).toBe(true);
});

test('creates a valid hash for empty url, with no logs', async () => {
  const {output} = await catchConsoleLog( async () => {
    const oldEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test-no-logs';
    const url = "";

    let unsubs;
    await (new Promise( (resolve) => {
      unsubs = cache.fetch( url, (data) => {
        expect(data).toBeDefined();
        expect(data.tested).toBe(true);
        resolve();
      }, onError);
    }));

    unsubs();
    process.env.NODE_ENV = oldEnv;
  });
  expect(output.length).toBe(0);
});

test('cache fetch should catch all in-promise errors', async () => {
  const url = "test4";
  const errorThrown = new Error("Testing no error catcher");

  let unsubs;
  let gotError;
  try {
    // Silence output
    await catchConsoleLog( async () => {
      unsubs = cache.fetch( url, (data) => { throw errorThrown });
      await delay(550);
    });
  } catch(err) {
    // Should not pass over here
    gotError = err;
  }
  expect(gotError).toBeUndefined();

  // Silence output
  await catchConsoleLog( unsubs );
});

test('cache fetch collects error', async () => {
  const url = "test5";
  const errorThrown = new Error("Testing errors");

  let unsubs;
  // Silence output
  await catchConsoleLog( () => new Promise( (resolve) => {
    unsubs = cache.fetch(
      url,
      (data) => { throw errorThrown },
      (error) => {
        expect(error).toBe(errorThrown);
        resolve();
      }
    );
  }));

  // Silence output
  await catchConsoleLog( unsubs );
});

test('cache fetch does not collects AbortError', async () => {
  const url = "test6";
  const fetchThrowErrorOld = mockedFetch.options.throwError;
  mockedFetch.options.throwError = new AbortError("Testing abort errors");

  const notToBeCalled = jest.fn();

  let unsubs;
  const {output} = await catchConsoleLog( async () => {
    unsubs = cache.fetch(
      url,
      notToBeCalled,
      notToBeCalled,
    );

    await delay(1200);
  });

  expect(output.filter(o => o.includes("Connection aborted")).length).toBe(1);

  expect(notToBeCalled).toBeCalledTimes(0);
  await catchConsoleLog( unsubs );
  mockedFetch.options.throwError = fetchThrowErrorOld;
});

test('cache fetch collects network and server errors', async () => {
  const url = "test7";

  const {output} = await catchConsoleLog( async () => {
    // Mock fetchResponseOptions
    const fetchResponseOptionsOld = mockedFetch.options.responseOptions;

    // Test server error
    mockedFetch.options.responseOptions = () => ({
      status: 401,
      statusText: "Testing unauthorized request",
      ok: false,
    });

    let unsubs;
    await (new Promise( (resolve, reject) => {
      unsubs = cache.fetch(
        url,
        (data) => {
          expect(data).toBeUndefined()
          reject();
        },
        (error) => {
          expect(error.message)
            .toBe(`${url}: Cache Element backend: ${mockedFetch.options.responseOptions().statusText}`);
          resolve();
        }
      );
    }));

    // Test network error
    mockedFetch.options.responseOptions = () => ({
      status: 599,
      statusText: "Testing 599 Network Timeout",
    });

    await (new Promise( (resolve, reject) => {
      cache.fetch(
        url,
        (data) => {
          expect(data).toBeUndefined()
          reject();
        },
        (error) => {
          expect(error.message)
            .toBe(`${url}: Cache Element backend: ${mockedFetch.options.responseOptions().statusText}`);
          resolve();
        }
      );
    }));

    await catchConsoleLog( unsubs );

    // Unmock fetchResponseOptions
    mockedFetch.options.responseOptions = fetchResponseOptionsOld;
  });

  expect(output.filter(o => o.includes("Added listener")).length).toBe(2);
});
