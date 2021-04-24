import React from 'react';
import { render, createEvent, fireEvent, act, waitFor, screen, cleanup } from '@testing-library/react';

import './testSetup';
import Theme from './Theme';

test('renders theme selector', () => {
  const onThemeChange = jest.fn();
  let theme;
  act(() => {
    theme = render(
      <Theme theme={'light'} onThemeChange={onThemeChange} />
    );
 
    const title = theme.getByText("Theme.Theme");
    expect(title).toBeInTheDocument();
  });

  // Find `Dark` and click on it
  act(() => {
    const toSelect = theme.getByLabelText("Theme.Dark");
    expect(toSelect).toBeInTheDocument();

    fireEvent.click(toSelect);
    expect(onThemeChange).toHaveBeenCalledWith('dark');
  });
});
