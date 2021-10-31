import React from 'react'
import PropTypes from 'prop-types'

import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

// Renders an item into the widget's popup actions menu
// Ensures click event uses widget id
function WidgetMenuItemForwarded (props, ref) {
  const { onClick, option, icon, label } = props
  const handleClick = () => onClick(option)
  return (
    <MenuItem key={option} onClick={handleClick} ref={ref}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label || option} />
    </MenuItem>
  )
}

const WidgetMenuItem = React.forwardRef(WidgetMenuItemForwarded)

WidgetMenuItem.propTypes = {
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  option: PropTypes.string.isRequired
}

export default WidgetMenuItem
