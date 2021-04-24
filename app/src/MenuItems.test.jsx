import React from 'react';
import { render, createEvent, fireEvent, act, waitFor, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event'

import { MemoryRouter as Router } from 'react-router-dom';
import List from '@material-ui/core/List';

import './testSetup';
import { delay, LocationDisplay } from './testHelpers';
import { MainMenuItems, SecondaryMenuItems, ListItemLink } from './MenuItems';

test('renders ListItemLink', async () => {
  const item = render(
    <Router>
      <ListItemLink to="with"    primary={ "With icon" } icon={ <div role="icon" /> } />
      <ListItemLink to="without" primary={ "Without icon" } />
    </Router>
  );

  const [withIcon, withoutIcon] = item.getAllByRole('button');
  expect(withIcon.querySelector('[role="icon"]')).toBeInTheDocument();
  expect(withoutIcon.querySelector('[role="icon"]')).toBe(null);
});

test('renders MenuItems', () => {
  let menu;
  let buttons;

  const menuCreator = (initial) => (
    <Router initialEntries={[ initial ]}>
      <List><MainMenuItems /></List>
      <List><SecondaryMenuItems /></List>
      <LocationDisplay/>
    </Router>
  );

  act(() => {
    menu = render( menuCreator('') );

    buttons = menu.getAllByRole('button');
    expect(buttons.length).toBe(3);
  });

  act(() => {
    for (const button of buttons) {
      // Simulate a click in a hash route
      const url = button.href.replace(/^[^#]*/, '');
      menu.unmount();
      menu = render( menuCreator(url) );

      // Test hash is the passed one
      const location = menu.getByTestId("location-display");
      expect(location).toHaveTextContent(url);
    }
  });
});
