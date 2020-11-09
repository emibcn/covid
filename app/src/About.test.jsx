import React from 'react';
import { render, createEvent, fireEvent, act, screen } from '@testing-library/react';

import './testSetup';
import About from './About';

test('renders about component', () => {
  const about = render(<About />);
  const element = about.getByText(/This applications displays public information extracted from the official web/i);
  expect(element).toBeInTheDocument();
});

