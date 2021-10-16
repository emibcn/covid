import React from 'react'
import {
  render,
  createEvent,
  fireEvent,
  act,
  waitFor,
  screen,
  cleanup
} from '@testing-library/react'

import './testSetup'
import { catchConsoleError } from './testHelpers'
import ErrorCatcher from './ErrorCatcher'

test('renders correctly its children', () => {
  const text = "I'm a child"
  const errorCatcher = render(
    <ErrorCatcher>
      <div>{text}</div>
    </ErrorCatcher>
  )

  const child = errorCatcher.getByText(text)
  expect(child).toBeInTheDocument()
})

test('renders error when some `render` throws an error and reloads page when the button is clicked', async () => {
  const text = "I'm a child"
  const error = "I'm an error"
  const BuggyChild = (props) => {
    throw new Error(error)
  }

  let errorCatcher
  await act(async () => {
    const { output, fn } = await catchConsoleError(() => {
      errorCatcher = render(
        <ErrorCatcher>
          {/* Buggy's siblings are not shown, either */}
          <div>{text}</div>
          <BuggyChild>
            <div>{text}</div>
          </BuggyChild>
        </ErrorCatcher>
      )
    })

    expect(fn).toHaveBeenCalledTimes(2)
    expect(output[0].includes(error)).toBe(true)

    const childError = errorCatcher.getByText(error)
    expect(childError).toBeInTheDocument()

    expect(() => errorCatcher.getByText(text)).toThrowError(
      /Unable to find an element/
    )
  })

  act(() => {
    const button = errorCatcher.getByText(
      'ErrorCatcher.Try reloading the app to recover from it'
    )
    expect(button).toBeInTheDocument()

    // Mock page reloader
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { reload: jest.fn() }
    })

    fireEvent.click(button)
    expect(window.location.reload).toHaveBeenCalled()
  })
})
