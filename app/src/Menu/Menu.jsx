import React from 'react'
import PropTypes from 'prop-types'

import { translate } from 'react-translate'

import clsx from 'clsx'

import { useTheme } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Tooltip from '@material-ui/core/Tooltip'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleUp as faUpgrade } from '@fortawesome/free-solid-svg-icons'

import MenuContent from './MenuContent'
import useStyles from './useStyles'

// Renders the menu, responsive
function MenuUntranslated (props) {
  const {
    handleDrawerOpen,
    handleDrawerClose,
    open,
    newServiceWorkerDetected,
    onLoadNewServiceWorkerAccept,
    t
  } = props
  const classes = useStyles()
  const theme = useTheme()
  const isBig = useMediaQuery(theme.breakpoints.up('md'))
  const DrawerComponent = isBig ? Drawer : SwipeableDrawer
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent)

  const toggleDrawer = (open) => (/* event */) => {
    if (open) {
      handleDrawerOpen()
    } else {
      handleDrawerClose()
    }
  }

  const handleClickUpdate = (e) => {
    e.preventDefault()
    handleDrawerClose()
    onLoadNewServiceWorkerAccept()
  }

  return (
    <DrawerComponent
      {...(isBig
        ? {
            variant: 'permanent'
          }
        : {
            anchor: 'left',
            onClose: toggleDrawer(false),
            onOpen: toggleDrawer(true),
            disableBackdropTransition: !iOS,
            disableDiscovery: iOS
          })}
      classes={{
        paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)
      }}
      open={open}
    >
      <MenuContent handleDrawerClose={handleDrawerClose} />
      {newServiceWorkerDetected
        ? (
          <ListItem
            button
            onClick={handleClickUpdate}
            className={classes.updateItem}
          >
            <Tooltip title={t('Update!')}>
              <ListItemIcon>
                <FontAwesomeIcon
                  icon={faUpgrade}
                  style={{ fontSize: '1.5rem', color: 'green' }}
                />
              </ListItemIcon>
            </Tooltip>
            <ListItemText primary={t('Update!')} />
          </ListItem>
          )
        : null}
    </DrawerComponent>
  )
}

MenuUntranslated.propTypes = {
  handleDrawerOpen: PropTypes.func.isRequired,
  handleDrawerClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onLoadNewServiceWorkerAccept: PropTypes.func.isRequired,
  newServiceWorkerDetected: PropTypes.bool.isRequired
}

const Menu = translate('Menu')(MenuUntranslated)

export default Menu
