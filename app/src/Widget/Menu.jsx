import React from 'react'
import PropTypes from 'prop-types'

import { translate } from 'react-translate'

import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'

import WidgetMenuItem from './MenuItem'

// Renders the widget's popup actions menu
function WidgetMenu (props) {
  const { onClick, options, id, ...restProps } = props
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  // Sets the element where the popup menu will open next to
  const handleClickOpen = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  // When an element is clicked, close menu and call parent's onClick
  const handleClickElement = (value) => {
    handleClose()
    onClick(value)
  }

  // Render the open icon button and, if in open
  // state, the menu with all elements but `view`
  return (
    <>
      <IconButton
        aria-label='actions'
        aria-controls={anchorEl ? `widget-menu-${id}` : null}
        aria-haspopup='true'
        onClick={handleClickOpen}
      >
        <FontAwesomeIcon icon={faEllipsisV} />
      </IconButton>
      {anchorEl
        ? (
          <Menu
            id={`widget-menu-${id}`}
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                width: '20ch'
              }
            }}
          >
            {Object.keys(options)
              .filter((option) => option !== 'view')
              .map((option) => (
                <WidgetMenuItem
                  key={option}
                  option={option}
                  onClick={handleClickElement}
                  icon={options[option].icon}
                  label={
                  typeof options[option].label === 'function'
                    ? options[option].label(restProps)
                    : options[option].label
                }
                />
              ))}
          </Menu>
          )
        : null}
    </>
  )
}

const optionPropTypes = PropTypes.shape({
  icon: PropTypes.element,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired
})

WidgetMenu.propTypes = {
  id: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  options: PropTypes.shape({
    // These options are mandatory
    remove: optionPropTypes.isRequired,
    view: optionPropTypes.isRequired
    // Other options are optionals
  }).isRequired
}

export default translate('Widget')(WidgetMenu)
