import React from 'react'
import PropTypes from 'prop-types'

import { translate } from 'react-translate'

import Tooltip from '@material-ui/core/Tooltip'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'

// Renders an item into the widget's popup actions menu
// Ensures click event uses widget id
const WidgetMenuItem = React.forwardRef((props, ref) => {
  const { onClick, option, icon, label } = props
  const handleClick = () => onClick(option)
  return (
    <MenuItem key={option} onClick={handleClick} ref={ref}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label || option} />
    </MenuItem>
  )
})

const MenuAddWidget = React.memo((props) => {
  const { t, onAdd, options } = props

  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  // Sets the element where the popup menu will open next to
  const handleClickOpen = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  // When an element is clicked, close menu and call parent's onClick
  const handleClickElement = (value) => {
    handleClose()
    onAdd(value)
  }

  return (
    <>
      <Tooltip title={t('Add a graph')} aria-label={t('add')}>
        <Fab
          color='primary'
          aria-label={t('add')}
          onClick={handleClickOpen}
          aria-haspopup='true'
        >
          <AddIcon />
        </Fab>
      </Tooltip>
      {anchorEl ? (
        <Menu
          id='widget-add-menu'
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'right'
          }}
          PaperProps={{
            style: {
              width: '30ch'
            }
          }}
        >
          {options.map((option) => (
            <WidgetMenuItem
              key={option.key}
              option={option.key}
              onClick={handleClickElement}
              icon={option.icon}
              label={t(option.name)}
            />
          ))}
        </Menu>
      ) : null}
    </>
  )
})

MenuAddWidget.propTypes = {
  onAdd: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.element.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired
}

export default translate('MenuAddWidget')(MenuAddWidget)
