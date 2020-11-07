import cache from './Cache';

import { delay } from '../../testHelpers';

let fetchOriginal;
let fetchDate = new Date();
beforeAll(() => {
  // Mock fetch
  fetchOriginal = window.fetch;
  window.fetch = jest.fn( async (url, options) => {
    await delay(500);
    return new Response(JSON.stringify({tested: true, url}), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'last-modified': fetchDate.toString(),
      }
    });
  });
});

afterAll(() => {
  // Unmock fetch
  window.fetch = fetchOriginal;
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
  await cache.invalidate(url);

  fetchDate = new Date();
  cache.checkIfNeedUpdate(
    url,
    (needUpdate) => {
      expect(needUpdate).toBe(true);
      done();
    },
    onError
  );

  // Unsubscribe again both URLs: should throw warning
  unsubscribe();
});

test('cache correctly invalidates a subscribed URL and detects if it needs an update', async () => {
  const url = "test2";

  await cache.invalidate(url);
  let unsubs;
  await (new Promise(resolve => {
    unsubs = cache.fetch(url, () => {
      resolve();
    }, () => {});
  }));

  // Mock a backend update and check if it is detected
  fetchDate = new Date();
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
});

test('cache fetch collects error', (done) => {
  const url = "test3";
  const errorThrown = new Error("Testing errors");
  cache.fetch(
    url,
    (data) => { throw errorThrown },
    (error) => {
      expect(error).toBe(errorThrown);
      done();
    }
  );
});

/*
  TODO:
   - Add test for: fetch (no wait) -> unsubscribe (with abort) -> invalidate (never downloaded)
   - Add test for errorish responses: 200 not ok, not 200
   - Add test without declaring onError (throw in onSuccess and catch with expect?)
   - Capture and test logs
   - Count some more calls to fetch
*/
