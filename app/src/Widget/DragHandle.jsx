import React from 'react'
import PropTypes from 'prop-types'

import { SortableHandle } from 'react-sortable-hoc'

// Used to sort the widget
function DragHandleInner ({ children, classes }) {
  return <span className={classes.draggableWidgetTitle}>{children}</span>
}

DragHandleInner.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.shape({
    draggableWidgetTitle: PropTypes.string
  })
}

DragHandleInner.defaultProps = {
  children: <></>,
  classes: {
    draggableWidgetTitle: ''
  }
}

const DragHandle = SortableHandle(DragHandleInner)

export default DragHandle
