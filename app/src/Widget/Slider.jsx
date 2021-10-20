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
const ValueLabelComponent = (props) => {
  const { children, open, value } = props
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
  const { classes = {} } = props
  const restProps = React.useMemo(() => {
    // Remove classes from restProps
    // eslint-disable-next-line no-unused-vars
    const { classes: _, ...rest } = props
    return rest
  }, [props])
  const { playPause } = classes
  const restClasses = React.useMemo(() => {
    // Remove our class from classes
    // eslint-disable-next-line no-unused-vars
    const { playPause: _, ...rest } = classes
    return rest
  }, [classes])

  // Compose components
  const { value, max, onChange } = props
  return (
    <>
      <SliderLib
        ValueLabelComponent={ValueLabelComponent}
        step={1}
        min={0}
        classes={restClasses}
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
  children: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.node.isRequired
}

export default Slider
