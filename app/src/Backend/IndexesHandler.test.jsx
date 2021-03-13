import React from 'react';
import { render, createEvent, fireEvent, act, screen, within, waitFor } from '@testing-library/react';

import {
  catchConsoleError,
  catchConsoleLog
} from '../testHelpers';

import Provider from './Provider';
import IndexesHandler from './IndexesHandler';

/*
 * TODO:
 *  - Mock backend handlers and test it's methods have been called
 *  - Test side effects removal on unmount
 *  - Integration: Test actual data has been downloaded, parsed and cached
 * */

// Mock the <Loading/> component
jest.mock('../Loading', () => {
  return {
    __esModule: true,
    default: (props) => <div role="loading">Loading</div>,
  }
});

test('fails to render without the context providers', async () => {
  // No provider at all
  const {output} = await catchConsoleError( async () => {
    expect( () => render(<IndexesHandler />) )
      .toThrowError();
  });
  expect(output[1].includes(`Handler must be used within a`)).toBe(true);
});

test('fails to render without the context providers', async () => {
  // No provider at all
  const {output} = await catchConsoleError( async () => {
    expect( () => render(<IndexesHandler />) )
      .toThrowError();
  });
  expect(output[1].includes(`Handler must be used within a`)).toBe(true);
});

test('renders properly when rendered inside the multi-provider', async () => {
  // Discard some logs
  await catchConsoleLog( async () => {
    const rendered = render(
      <Provider>
        <IndexesHandler>
          <span role="child" />
        </IndexesHandler>
      </Provider>
    );

    // Initially show a Loading component
    const loading = rendered.getByRole("loading");
    expect(loading).toBeInTheDocument();

    // Then the child component
    await waitFor(() => {
      const child = rendered.getByRole("child");
      expect(child).toBeInTheDocument();
    });

    // TODO: Test clearing side effects
    rendered.unmount();
  });
});
