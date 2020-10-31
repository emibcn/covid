import React from 'react';
import { render, createEvent, fireEvent, act, waitFor, screen, cleanup } from '@testing-library/react';
import './testSetup';

import Loading from './Loading';

test('renders loading image', () => {
  const loading = render(
    <Loading/>
  );

  const img = loading.getByAltText("Loading...");
  expect(img).toBeInTheDocument();
});
