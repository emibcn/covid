import {
  delay,
  catchConsoleLog,
  catchConsoleWarn,
  catchConsoleError
} from '../../testHelpers'

import GHPages from './GHPages'

/*
  TODO:
   - Test `scheduleNextUpdate` with recursive
   - Test `scheduleNextUpdate` without `onBeforeUpdate` and `onAfterUpdate`
   - Test `millisToNextUpdate` with an extra day timelapse (`officialUpdateTime` on today, but earlier than now)
   - Test `abort`
*/
const mockDelay = delay
class MockCache {
  success = true
  successValue = true
  errorValue = new Error('Test cache checkIfNeedUpdate error')

  run = async (url, onSuccess, onError) => {
    await mockDelay(10)
    if (this.success) {
      await onSuccess(this.successValue)
    } else {
      await onError(this.errorValue)
    }
  }
}
const mockCache = new MockCache()
jest.mock('./Cache', () => {
  return {
    __esModule: true,
    default: {
      invalidate: jest.fn(async (url) => {
        await mockDelay(10)
      }),
      checkIfNeedUpdate: (...args) => mockCache.run(...args)
    }
  }
})

class TestGHPages extends GHPages {
  indexUrl = 'testIndex'

  // Invalidate all URLs, except index
  invalidateAll = jest.fn(async () => {
    await delay(10)
  })
}

test('GHPages correctly checks for updates', async () => {
  const testGHPages = new TestGHPages()
  const onSuccess = jest.fn(() => console.log('SUCCESS'))
  const onError = jest.fn((err) => console.error('ERROR:', err))

  // Test success with update needed
  const { output: outputSuccess } = await catchConsoleLog(
    async () => await testGHPages.checkUpdate(onSuccess, onError)
  )
  expect(onSuccess).toHaveBeenCalledTimes(1)
  expect(onError).toHaveBeenCalledTimes(0)
  expect(onSuccess).toHaveBeenCalledWith(mockCache.successValue)
  expect(outputSuccess[0].includes('update needed')).toBe(true)

  // Test error
  mockCache.success = false
  const { output: outputError } = await catchConsoleError(
    async () => await testGHPages.checkUpdate(onSuccess, onError)
  )
  expect(onSuccess).toHaveBeenCalledTimes(1)
  expect(onError).toHaveBeenCalledTimes(1)
  expect(outputError[1].includes('Test cache checkIfNeedUpdate error')).toBe(
    true
  )
  mockCache.success = true
})

test('GHPages correctly warns about the need to overload `invalidateAll`', async () => {
  const testGHPages = new GHPages()
  const { output } = await catchConsoleWarn(
    async () => await testGHPages.invalidateAll()
  )
  expect(output[0].includes('abstract function')).toBe(true)
})

test('GHPages correctly updates all own URLs', async () => {
  const testGHPages = new TestGHPages()
  const callback = jest.fn()
  const { output } = await catchConsoleLog(
    async () => await testGHPages.updateAll(callback)
  )
  expect(output[0].includes('Invalidate index')).toBe(true)
  expect(testGHPages.invalidateAll).toHaveBeenCalledTimes(1)
  expect(callback).toHaveBeenCalledTimes(1)
})

test('GHPages correctly updates all own URLs, if needed', async () => {
  const testGHPages = new TestGHPages()
  const callback = jest.fn()

  // Test no need to update
  mockCache.successValue = false
  const { output } = await catchConsoleLog(
    async () => await testGHPages.updateIfNeeded(callback)
  )
  expect(output[0].includes('update needed: false')).toBe(true)
  expect(testGHPages.invalidateAll).toHaveBeenCalledTimes(0)
  expect(callback).toHaveBeenCalledTimes(1)
  expect(callback).toHaveBeenCalledWith(false)
  mockCache.successValue = true

  // Test need to update
  const { output: output2 } = await catchConsoleLog(async () => {
    await testGHPages.updateIfNeeded(callback)
  })
  expect(output2[0].includes('update needed: true')).toBe(true)
  expect(testGHPages.invalidateAll).toHaveBeenCalledTimes(1)
  expect(callback).toHaveBeenCalledTimes(2)
  expect(callback).toHaveBeenCalledWith(true)
})

test('GHPages correctly schedules next update loop', async () => {
  const testGHPages = new TestGHPages()

  // Generate a date in the near future
  const future = new Date()
  future.setMinutes(future.getMinutes() + 2)
  testGHPages.officialUpdateTime = [
    future.getHours(),
    future.getMinutes(),
    future.getSeconds()
  ]

  // Generate a string with the generated date, prepending '0' to each value if it's smaller than 10
  const pad2 = (num) => `${num < 10 ? '0' : ''}${num}`
  const expectedTimeString = testGHPages.officialUpdateTime.map(pad2).join(':')

  // First try: update on mocked schedule
  const { output } = await catchConsoleLog(async () => {
    testGHPages.scheduleNextUpdate()
  })
  expect(output[0].includes('Next update on')).toBe(true)
  expect(output[0].includes(expectedTimeString)).toBe(true)
  expect(testGHPages.invalidateAll).toHaveBeenCalledTimes(0)

  testGHPages.cancelUpdateSchedule()

  // Second try: update on `nextMillis` milliseconds
  const nextMillis = 20
  const options = {
    millis: nextMillis,
    notUpdatedMillis: 10,
    onBeforeUpdate: jest.fn(),
    onAfterUpdate: jest.fn()
  }
  const { output: output2 } = await catchConsoleLog(async () => {
    testGHPages.scheduleNextUpdate(options)
  })
  expect(output2[0].includes('Next update on')).toBe(true)

  // Should not have been updated yet (before wait)
  expect(testGHPages.invalidateAll).toHaveBeenCalledTimes(0)
  expect(options.onBeforeUpdate).toHaveBeenCalledTimes(0)
  expect(options.onAfterUpdate).toHaveBeenCalledTimes(0)

  // Silence output
  const checkUpdateOld = testGHPages.checkUpdate.bind(testGHPages)
  testGHPages.checkUpdate = jest.fn(async (...args) => {
    await catchConsoleLog(async () => {
      await checkUpdateOld(...args)
    })
  })

  // Force to recurse to next try (no update needed yet)
  mockCache.successValue = false
  await delay(nextMillis)
  expect(options.onBeforeUpdate).toHaveBeenCalledTimes(1)
  expect(options.onAfterUpdate).toHaveBeenCalledTimes(0)

  await delay(10)
  expect(options.onBeforeUpdate).toHaveBeenCalledTimes(1)
  expect(options.onAfterUpdate).toHaveBeenCalledTimes(1)

  // Set to need an update
  mockCache.successValue = true
  await delay(10)
  expect(options.onBeforeUpdate).toHaveBeenCalledTimes(2)
  expect(options.onAfterUpdate).toHaveBeenCalledTimes(1)

  await delay(nextMillis + 15)
  expect(options.onBeforeUpdate).toHaveBeenCalledTimes(2)
  expect(options.onAfterUpdate).toHaveBeenCalledTimes(2)

  // Should already have been updated (after wait)
  expect(testGHPages.invalidateAll).toHaveBeenCalledTimes(1)
})
