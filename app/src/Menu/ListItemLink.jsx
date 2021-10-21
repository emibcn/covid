import React from 'react'
import PropTypes from 'prop-types'
import { Link as RouterLink } from 'react-router-dom'

import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Tooltip from '@material-ui/core/Tooltip'

function ListItemLink ({ icon, primary, to }) {
  const renderLink = React.useMemo(
    () => {
      function RouterLinkForwarded (itemProps, ref) {
        return (
          <RouterLink to={to} ref={ref} {...itemProps} />
        )
      }
      return React.forwardRef(RouterLinkForwarded)
    },
    [to]
  )

  return (
    <li>
      <ListItem button component={renderLink}>
        {typeof icon !== 'undefined' && icon !== ''
          ? (
            <Tooltip title={primary}>
              <ListItemIcon>{icon}</ListItemIcon>
            </Tooltip>
            )
          : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  )
}

ListItemLink.propTypes = {
  icon: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string
  ]),
  primary: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired
}

ListItemLink.defaultValues = {
  icon: ''
}

export default ListItemLink
