import React from 'react'
import PropTypes from 'prop-types'

import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles } from '@material-ui/core/styles'

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
function ValueLabelComponent ({ children, open, value }) {
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

export default ValueLabelComponent
