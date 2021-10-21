import React from 'react'
import PropTypes from 'prop-types'

import DragIndicatorIcon from '@material-ui/icons/DragIndicator'

import DragHandle from './DragHandle'

// Use an Icon to handle dragging
function DragHandleWithIndicatorIcon ({ classes }) {
  return (
    <DragHandle classes={classes}>
      <DragIndicatorIcon />
    </DragHandle>
  )
}

DragHandleWithIndicatorIcon.propTypes = {
  classes: PropTypes.shape({
    draggableWidgetTitle: PropTypes.string
  })
}

DragHandleWithIndicatorIcon.defaultProps = {
  classes: {
    draggableWidgetTitle: ''
  }
}

export default DragHandleWithIndicatorIcon
