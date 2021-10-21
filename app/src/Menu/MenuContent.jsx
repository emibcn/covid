import React from 'react'
import PropTypes from 'prop-types'

import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import List from '@material-ui/core/List'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'

import { translate } from 'react-translate'

import { MainMenuItems, SecondaryMenuItems } from './MenuItems'
import useStyles from './useStyles'

function MenuContentUntranslated ({ t, handleDrawerClose }) {
  const classes = useStyles()
  return (
    <>
      <div className={classes.toolbarIcon}>
        <IconButton
          edge='start'
          color='inherit'
          aria-label={t('close menu')}
          onClick={handleDrawerClose}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component='h1'
          variant='h6'
          color='inherit'
          noWrap
          className={classes.title}
        >
          {t('Menu')}
        </Typography>
        <IconButton aria-label={t('close menu')} onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <List>
        <MainMenuItems />
      </List>
      <Divider />
      <List>
        <SecondaryMenuItems />
      </List>
    </>
  )
}

MenuContentUntranslated.propTypes = {
  t: PropTypes.func.isRequired,
  handleDrawerClose: PropTypes.func.isRequired
}

const MenuContent = translate('Menu')(MenuContentUntranslated)

export default MenuContent
