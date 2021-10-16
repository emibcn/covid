import React from 'react'
import {
  render,
  createEvent,
  fireEvent,
  act,
  screen,
  within
} from '@testing-library/react'

import { catchConsoleError } from '../testHelpers'

import Provider from './Provider'

import BcnProvider, { withHandler as withBcnHandler } from './Bcn/context'
import MapProvider, { withHandler as withMapHandler } from './Maps/context'
import ChartProvider, {
  withHandler as withChartHandler
} from './Charts/context'

const Child = ({
  mapsDataHandler,
  bcnDataHandler,
  chartsDataHandler,
  ...props
}) => (
  <div role='child' {...props}>
    <span role='Map'>{mapsDataHandler.toString()}</span>
    <span role='Bcn'>{bcnDataHandler.toString()}</span>
    <span role='Chart'>{chartsDataHandler.toString()}</span>
  </div>
)

const WrappedChild = withBcnHandler(withMapHandler(withChartHandler(Child)))

test('a multiple context consumer fails when rendered without any provider', async () => {
  // No provider at all
  const { output } = await catchConsoleError(async () => {
    expect(() =>
      render(<WrappedChild data-value='test-props' />)
    ).toThrowError()
  })
  expect(output[1].includes('Handler must be used within a')).toBe(true)
})

const Providers = [
  { name: 'bcn', Provider: BcnProvider },
  { name: 'maps', Provider: MapProvider },
  { name: 'charts', Provider: ChartProvider }
]

test('a multiple context consumer fails when rendered with only one provider', async () => {
  // Only one provider
  await Promise.all(
    Providers.map(({ Provider }) => Provider).map(async (OneProvider) => {
      const { output } = await catchConsoleError(async () => {
        expect(() =>
          render(
            <OneProvider>
              <WrappedChild data-value='test-props' />
            </OneProvider>
          )
        ).toThrowError()
      })

      expect(output[1].includes('Handler must be used within a')).toBe(true)
    })
  )
})

test('a multiple context consumer fails when rendered with only two providers', async () => {
  // Reduces a list of providers to a tree of components, each containing the previous
  // The most inner one, contains the passed children
  const ProviderReducer =
    (Providers) =>
      ({ children }) =>
        Providers.reduce(
          (child, Provider) => <Provider>{child}</Provider>,
          children
        )

  await Promise.all(
    Providers.map(async (OneProvider) => {
      const { output } = await catchConsoleError(async () => {
        // Exclude current Provider
        const Selected = Providers.filter(
          (pr) => pr.name !== OneProvider.name
        ).map(({ Provider }) => Provider)

        // Combine selected providers into one component
        const TwoProviders = ProviderReducer(Selected)
        expect(() =>
          render(
            <TwoProviders>
              <WrappedChild data-value='test-props' />
            </TwoProviders>
          )
        ).toThrowError()
      })

      expect(
        output[1].includes(
          `Handler must be used within a ${OneProvider.name}DataHandler`
        )
      ).toBe(true)
    })
  )
})

test('a multiple context consumer is rendered properly when rendered inside the multi-provider', async () => {
  const rendered = render(
    <Provider>
      <WrappedChild data-value='test-props' />
    </Provider>
  )
  const child = rendered.getByRole('child')
  expect(child).toBeInTheDocument();

  ['Bcn', 'Map', 'Chart'].forEach((backend) => {
    const testBackend = within(child).getByRole(backend)
    expect(testBackend).toHaveTextContent(`class ${backend}DataHandler`)
  })
})
