import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'

import '../testSetup'
import App from '../App'

jest.mock('../Backend', () => {
  return {
    __esModule: true,
    BackendProvider: ({ children }) => <>{children}</>,
    IndexesHandler: ({ children }) => <>{children}</>
  }
})

jest.mock('../Widget', () => {
  return {
    __esModule: true,
    WidgetsList: () => <div>WidgetsList</div>
  }
})

test('renders copyright link', () => {
  const { getByText } = render(<App onLoadNewServiceWorkerAccept={() => {}} />)
  const linkElement = getByText(/Source code of/i)
  expect(linkElement).toBeInTheDocument()
})

test('menu shows detected new service worker', async () => {
  let app
  act(() => {
    app = render(<App onLoadNewServiceWorkerAccept={() => {}} />)
  })
  await act(async () => {
    const event = new CustomEvent('onNewServiceWorker', {
      detail: { registration: true }
    })
    fireEvent(document, event)
    const updateElement = await app.findByText('1') // Detect menu badge
    expect(updateElement).toBeInTheDocument()
  })
})

test('translates app into detected language', async () => {
  const languageGetter = jest.spyOn(window.navigator, 'language', 'get')
  await act(async () => {
    languageGetter.mockReturnValue('en-US')
    const app = render(<App onLoadNewServiceWorkerAccept={() => {}} />)
    const [codeElement] = await app.findAllByText('Refactored')
    expect(codeElement).toBeInTheDocument()
    // Ensure app is fully re-created to re-run the constructor
    app.unmount()
  })
  await act(async () => {
    languageGetter.mockReturnValue('ca-ES')
    const app = render(<App onLoadNewServiceWorkerAccept={() => {}} />)
    const [codeElement] = await app.findAllByText('Refactoritzada')
    expect(codeElement).toBeInTheDocument()
  })
})
