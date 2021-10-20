import React from 'react'
import PropTypes from 'prop-types'

import SliderLib from '@material-ui/core/Slider'

import PlayPause from './PlayPause'
import ValueLabelComponent from './ValueLabelComponent'

/*
   Renders a Slider with a play/pause button next to it, inside a
   sticky container at the top of the page
*/
function Slider (props) {
  // TODO: Allow changing the timeout/speed

  // Manage props and classes
  const {
    classes = {},
    value,
    max,
    onChange,
    ...restProps
  } = props
  const { playPause, ...restClasses } = classes

  // Compose components
  return (
    <>
      <SliderLib
        ValueLabelComponent={ValueLabelComponent}
        step={1}
        min={0}
        classes={restClasses}
        value={value}
        max={max}
        onChange={onChange}
        {...restProps}
      />
      <PlayPause
        className={playPause}
        value={value}
        max={max}
        onChange={onChange}
      />
    </>
  )
}

Slider.propTypes = {
  classes: PropTypes.shape({
    playPause: PropTypes.string,
  }),
  value: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
}

Slider.defaultProps = {
  classes: {}
}

export default Slider
