import cache from './Cache';

import { delay, MockFetch, AbortError } from '../../testHelpers';

/*
  TODO:
   - Add test for fetch without declaring onError (throw in onSuccess and catch with expect?)
   - Capture and test logs
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
test('cache fetches only once for the same URL', (done) => {
  const url = "test";

  // Test results
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

    done();
  };

  // Launch test (act)
  const unsubs1 = cache.fetch(url, onSuccess, onError);
  const unsubs2 = cache.fetch(url, onSuccess2, onError);

  // Unsubscribe both URLs
  unsubscribe = () => {
    unsubs1();
    unsubs2();
  };
});

test('cache correctly detects if a cached URL needs to be updated', (done) => {
  const url = "test";

  cache.checkIfNeedUpdate(
    url,
    (needUpdate) => {
      expect(needUpdate).toBe(false);
      done();
    },
    onError
  );

  // No need to re-download
  const unsubs = cache.fetch(url, () => {}, onError);

  // Add new unsubscriber
  const oldUnsubscribe = unsubscribe;
  unsubscribe = () => {
    oldUnsubscribe();
    unsubs();
  }
});

test('cache correctly invalidates an unsubscribed URL', async (done) => {
  const url = "test";

  // Unsubscribe both URLs
  unsubscribe();

  // TODO: catch and test log message 'Someone downloaded it, but unregistered from it: changed data source'
  await cache.invalidate(url);

  mockedFetch.options.date = new Date();
  cache.checkIfNeedUpdate(
    url,
    (needUpdate) => {
      expect(needUpdate).toBe(true);
      done();
    },
    onError
  );

  // Unsubscribe again both URLs: should throw warning
  // TODO: catch and test 3 warning messages 'Listener not found'
  unsubscribe();
});

test('cache correctly invalidates a subscribed URL and detects if it needs an update', async () => {
  const url = "test2";

  // TODO: catch log 'It was never downloaded'
  await cache.invalidate(url);

  let unsubs;
  await (new Promise(resolve => {
    unsubs = cache.fetch(url, resolve, () => {});
  }));

  // Mock a backend update and check if it is detected
  mockedFetch.options.date = new Date();
  await (new Promise(resolve => {
    cache.checkIfNeedUpdate(
      url,
      (needUpdate) => {
        expect(needUpdate).toBe(true);
        resolve();
      },
      onError
    );
  }));

  // Invalidates the url. As it has one subscriber,
  // automatically downloads the new version
  await cache.invalidate(url);

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

  unsubs();
});

test('cache fetch (no wait) -> unsubscribe (with abort) -> invalidate (never downloaded)', async () => {
  const url = "test3";

  const unsubs = cache.fetch( url, () => {}, onError);

  unsubs();

  // It started the download, but never finished it (aborted with `unsubs`)
  await cache.invalidate(url);
});

test('creates a valid hash for empty url, with no logs', async () => {
  // TODO: Catch logs and test to '' (none)
  const oldEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'test-no-test';
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

test('cache fetch should catch all in-promise errors', async () => {
  const url = "test4";
  const errorThrown = new Error("Testing no error catcher");

  let unsubs;
  let gotError;
  try {
    unsubs = cache.fetch( url, (data) => { throw errorThrown });
    await delay(550);
  } catch(err) {
    // Should not pass over here
    gotError = err;
  }
  expect(gotError).toBeUndefined();

  unsubs();
});

test('cache fetch collects error', async () => {
  const url = "test5";
  const errorThrown = new Error("Testing errors");

  let unsubs;
  await (new Promise( (resolve) => {
    unsubs = cache.fetch(
      url,
      (data) => { throw errorThrown },
      (error) => {
        expect(error).toBe(errorThrown);
        resolve();
      }
    );
  }));

  unsubs();
});

test('cache fetch does not collects AbortError', async () => {
  const url = "test6";
  const fetchThrowErrorOld = mockedFetch.options.throwError;
  mockedFetch.options.throwError = new AbortError("Testing abort errors");

  const notToBeCalled = jest.fn();

  // TODO: catch logs and test for 'AbortError: Testing abort errors'
  const unsubs = cache.fetch(
    url,
    notToBeCalled,
    notToBeCalled,
  );

  await delay(1200);

  expect(notToBeCalled).toBeCalledTimes(0);
  unsubs();
  mockedFetch.options.throwError = fetchThrowErrorOld;
});

test('cache fetch collects network and server errors', async () => {
  const url = "test7";

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

  unsubs();

  // Unmock fetchResponseOptions
  mockedFetch.options.responseOptions = fetchResponseOptionsOld;
});
