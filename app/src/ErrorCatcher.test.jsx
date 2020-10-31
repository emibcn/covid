import React from 'react';
import { render, createEvent, fireEvent, act, waitFor, screen, cleanup } from '@testing-library/react';
import './testSetup';

import ErrorCatcher from './ErrorCatcher';

test('renders correctly its children', () => {
  const text = "I'm a child";
  const errorCatcher = render(
    <ErrorCatcher>
      <div>{ text }</div>
    </ErrorCatcher>
  );

  const child = errorCatcher.getByText(text);
  expect(child).toBeInTheDocument();
});

test('renders error when some `render` throws an error and reloads page when the button is clicked', () => {
  const text = "I'm a child";
  const error = "I'm an error";
  const BuggyChild = (props) => {
    throw new Error(error);
  };

  let errorCatcher;
  act(() => {
    errorCatcher = render(
      <ErrorCatcher>
        {/* Buggy's siblings are not shown, either */}
        <div>{ text }</div>
        <BuggyChild>
          <div>{ text }</div>
        </BuggyChild>
      </ErrorCatcher>
    );

    const childError = errorCatcher.getByText(error);
    expect(childError).toBeInTheDocument();
 
    expect(
      () => errorCatcher.getByText(text)
    ).toThrowError(/Unable to find an element/);
  });

  act(() => {
    const button = errorCatcher.getByText("ErrorCatcher.Try reloading the app to recover from it");
    expect(button).toBeInTheDocument();

    // Mock page reloader
    window.location.reload = jest.fn();
    fireEvent.click(button);
    expect(window.location.reload).toHaveBeenCalled();
  });
});
