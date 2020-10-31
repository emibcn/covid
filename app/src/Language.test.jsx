import React from 'react';
import { render, createEvent, fireEvent, act, waitFor, screen, cleanup } from '@testing-library/react';
import './testSetup';
import {
  delay,
  createStartTouchEventObject,
  createMoveTouchEventObject,
  createEndTouchEventObject
} from './testHelpers';

import Language from './Language';
import available from "./i18n/available";

test('renders language selector', () => {
  const onLanguageChange = jest.fn();
  let language;
  act(() => {
    language = render(
      <Language language={'es-ES'} onLanguageChange={onLanguageChange} />
    );
 
    const title = language.getByText("Language.Language");
    expect(title).toBeInTheDocument();
  });

  // Find `English` and click on it
  act(() => {
    const english = language.getByLabelText("English");
    expect(english).toBeInTheDocument();

    fireEvent.click(english);
    expect(onLanguageChange).toHaveBeenCalledWith('en');
  });
});
