import React from 'react';
// wait deprecated in favor of waitFor... In which version?
import { render, createEvent, fireEvent, act, screen, within, wait as waitFor } from '@testing-library/react';

import { catchConsoleError } from '../testHelpers';

import Provider from './Provider';
import IndexesHandler from './IndexesHandler';

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
  const rendered = render(
    <Provider>
      <IndexesHandler>
        <span role="child" />
      </IndexesHandler>
    </Provider>
  );
  const loading = rendered.getByRole("loading");
  expect(loading).toBeInTheDocument();

  await waitFor(() => {
    const child = rendered.getByRole("child");
    expect(child).toBeInTheDocument();
  });
});
