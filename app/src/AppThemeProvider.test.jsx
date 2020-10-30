import React from 'react';
import { render, createEvent, fireEvent, act, waitFor, screen, cleanup } from '@testing-library/react';
import './testSetup';
import TestRenderer from 'react-test-renderer';

import MatchMediaMock from 'jest-matchmedia-mock';

import AppThemeProvider from './AppThemeProvider';

let matchMedia;

beforeAll(() => {
  matchMedia = new MatchMediaMock();
});

afterEach(() => {
  matchMedia.clear();
});


test('renders AppThemeProvider with unset theme and unset browser mediaQuery', () => {
  const { getByText } = render(<AppThemeProvider />);
});

test('renders AppThemeProvider with unset theme, with mediaQuery set to light', () => {
  const mediaQuery = '(prefers-color-scheme: light)';
  matchMedia.useMediaQuery(mediaQuery);
  const { getByText } = render(<AppThemeProvider />);
});

test('renders AppThemeProvider with unset theme, with mediaQuery set to dark', () => {
  const mediaQuery = '(prefers-color-scheme: dark)';
  matchMedia.useMediaQuery(mediaQuery);
  const { getByText } = render(<AppThemeProvider />);
});

test('renders AppThemeProvider with dark theme', () => {
  const { getByText } = render(<AppThemeProvider type="dark" />);
});

test('renders AppThemeProvider with light theme', () => {
  const { getByText } = render(<AppThemeProvider type="light" />);
});

