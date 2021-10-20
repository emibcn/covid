import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import SliderLib from '@material-ui/core/Slider'
import Tooltip from '@material-ui/core/Tooltip'

import PlayPause from './PlayPause'

// Use special non-intrusive zIndex for the Slider tooltip
const useStyles = makeStyles({
  popper: {
    zIndex: 1200
  },
  tooltip: {
    fontSize: '1rem'
  }
})

// Component to render the label's value
const ValueLabelComponent = ({ children, open, value }) => {
  const classes = useStyles()

  return (
    <Tooltip
      open={open}
      enterTouchDelay={0}
      placement='bottom'
      title={value}
      classes={{
        popper: classes.popper,
        tooltip: classes.tooltip
      }}
      arrow
    >
      {children}
    </Tooltip>
  )
}

ValueLabelComponent.propTypes = {
  children: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.node.isRequired
}

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
