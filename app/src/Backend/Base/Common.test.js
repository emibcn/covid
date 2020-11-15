import { delay, MockFetch, AbortError } from '../../testHelpers';

import Common from './Common';

// Common is suposed to be extended
class TestCommon extends Common {
  constructor({onUpdate, ...rest}={}) {
    super(rest);
    this.onUpdate = onUpdate || (() => {});
  }
  subscribe = jest.fn( (url) => {
    return fetch( url, { signal: this.controller.signal })
      .then( this.handleFetchErrors )
      .then( response => response.json() )
      .then( this.onUpdate )
      .catch( this.catchFetchErrors )
  });
}

let mockedFetch = new MockFetch();
beforeAll(() => {
  mockedFetch.mock();
});

afterAll(() => {
  mockedFetch.unmock();
});

test('Common calls onUpdate', async () => {
  const url = 'test1';
  const options = {
    onUpdate: jest.fn(),
    onError: jest.fn(),
  };
  const testCommon = new TestCommon(options);
  await testCommon.subscribe(url);

  expect(options.onUpdate).toHaveBeenCalledTimes(1);
});

test('Common calls onError when error is thrown', async () => {
  const url = 'test1';
  const options = {
    onUpdate: jest.fn(),
    onError: jest.fn(),
  };
  const testCommon = new TestCommon(options);
  const fetchThrowErrorOld = mockedFetch.options.throwError;
  mockedFetch.options.throwError = new Error("Testing network/server errors");
  await testCommon.subscribe(url);

  expect(options.onError).toHaveBeenCalledTimes(1);
  mockedFetch.options.throwError = fetchThrowErrorOld;
});

test('Common does not calls onUpdate nor onError when thrown error is an AbortError', async () => {
  const url = 'test1';
  const options = {
    onUpdate: jest.fn(),
    onError: jest.fn(),
  };
  const testCommon = new TestCommon(options);
  const fetchThrowErrorOld = mockedFetch.options.throwError;
  mockedFetch.options.throwError = new AbortError("Testing abort errors");
  await testCommon.subscribe(url);

  expect(options.onUpdate).toHaveBeenCalledTimes(0);
  expect(options.onError).toHaveBeenCalledTimes(0);
  mockedFetch.options.throwError = fetchThrowErrorOld;
});

test('Common calls onError when response is errorish', async () => {
  const url = 'test1';
  const options = {
    onUpdate: jest.fn(),
    onError: jest.fn(),
  };
  const testCommon = new TestCommon(options);
  // Test server error
  const fetchResponseOptionsOld = mockedFetch.options.responseOptions;
  mockedFetch.options.responseOptions = () => ({
    status: 401,
    statusText: "Testing unauthorized request",
    ok: false,
  });
  await testCommon.subscribe(url);

  expect(options.onError).toHaveBeenCalledTimes(1);
  mockedFetch.options.responseOptions = fetchResponseOptionsOld;
});

test('Common uses noop default values for onUpdate and onError', async () => {
  const url = 'test1';
  const testCommon = new TestCommon();

  // Test for onUpdate
  const onUpdateOriginal = testCommon.onUpdate;
  testCommon.onUpdate = jest.fn(onUpdateOriginal);
  await testCommon.subscribe(url);

  expect(testCommon.onUpdate).toHaveBeenCalledTimes(1);

  // Test for onError
  const onErrorOriginal = testCommon.onError;
  testCommon.onError = jest.fn(onErrorOriginal);
  const fetchThrowErrorOld = mockedFetch.options.throwError;
  mockedFetch.options.throwError = new Error("Testing network/server errors");
  await testCommon.subscribe(url);

  expect(testCommon.onError).toHaveBeenCalledTimes(1);
  mockedFetch.options.throwError = fetchThrowErrorOld;
});

test('Common aborts a connection correctly', async () => {
  const url = 'test1';
  const testCommon = new TestCommon();

  // Mock controller's abort method to count its calls
  const abortOriginal = testCommon.controller.abort;
  const abortMocked = jest.fn(abortOriginal);
  testCommon.controller.abort = abortMocked;
  const promise = testCommon.subscribe(url);
  await delay(1);

  testCommon.abort();

  // Ensure promise is not left in background
  await promise;

  // Controller's abort has been called once
  expect(abortMocked).toHaveBeenCalledTimes(1);

  // Controller has been substituted, so abort function
  // must not be the same as before
  expect(abortMocked).not.toBe(testCommon.controller.abort);
});
