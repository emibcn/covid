import React from 'react';
import { render, createEvent, fireEvent, act, wait, screen } from '@testing-library/react';

import { delay, catchConsoleError } from '../testHelpers';
import Slider from './Slider';

test('renders slider', async () => {
  const onChange = jest.fn();
  const formatter = jest.fn(value => value);
  const values = [0,1,2,3,4,5,6,7,8,9,10];
  const marks = values
    .filter( value => value % 2)
    .map( ({value, index}) => ({ value: index, label: value }) );
  const marksSmall = marks.map( ({value}) => ({value}));
  const showMarkLabels = true;
  const objectCreator = (value) => {
    return (
      <Slider
        max={ values[ values.length - 1 ] }
        value={ value }
        onChange={ onChange }
        valueLabelFormat={ formatter }
        getAriaValueText={ formatter }
        // Marks without labels for small screens
        marks={ showMarkLabels ? marks : marksSmall }
        // Always visible on small screens
        valueLabelDisplay={ showMarkLabels ? null : "on" }
      />
    );
  };

  // Test render
  let slider;
  let playPause;
  act(() => {
    // Silence error/warning in external library
    catchConsoleError( () => {
      slider = render(objectCreator(values[ values.length - 1 ]));
    });

    const sliderEl = slider.getByRole("slider");
    expect(sliderEl).toBeInTheDocument();

    playPause = slider.getByLabelText("PlayPause.Toggle play status");
    expect(playPause).toBeInTheDocument();
  });

  // Test play feature
  await act( async () => {
    fireEvent.click(playPause);

    // Not changed yet
    await delay(0);
    expect(onChange).toHaveBeenCalledTimes(0);

    // Should have changed
    await delay(40);
    expect(onChange).toHaveBeenCalledTimes(1);

    // Should have changed again
    await delay(40);
    expect(onChange).toHaveBeenCalledTimes(2);

    // As the rendered value is the last one, the
    // next value should be 0
    expect(onChange).toHaveBeenCalledWith({}, 0);
  });

  // Test next value from a value not beeing the last
  await act( async () => {
    slider.rerender(objectCreator(0));

    // Should have changed
    await delay(41);
    expect(onChange).toHaveBeenCalledTimes(3);

    // As the rendered value is 0, the
    // next value should be 1
    expect(onChange).toHaveBeenCalledWith({}, 1);
  });

  // Test pause feature
  await act( async () => {
    fireEvent.click(playPause);

    // Should not have changed anymore
    await delay(41);
    expect(onChange).toHaveBeenCalledTimes(3);

    // Even should have not changed again
    await delay(41);
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  // Clear timer on unmount
  await act( async () => {
    fireEvent.click(playPause);

    // Should have changed again
    await wait(() => expect(onChange).toHaveBeenCalledTimes(4));

    slider.unmount();

    // Should NOT have changed again
    await delay(41);
    expect(onChange).toHaveBeenCalledTimes(4);
  });
});
