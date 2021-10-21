import React from 'react'
import PropTypes from 'prop-types'
import { Link as RouterLink } from 'react-router-dom'

import { translate } from 'react-translate'

/*
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
*/
import ThemeIcon from '@material-ui/icons/Brightness4'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faInfoCircle as faAbout,
  faLanguage
} from '@fortawesome/free-solid-svg-icons'

import ListItemLink from './ListItemLink'

function MainMenuItemsUntranslated (props) {
  const { t } = props
  return (
    <>
      {/* <ListItemLink to="/" primary={ "Dashboard" } icon={ <DashboardIcon /> } /> */}
      <ListItemLink
        to='#about'
        primary={t('About...')}
        icon={<FontAwesomeIcon style={{ fontSize: '1.5rem' }} icon={faAbout} />}
      />
      <ListItemLink
        to='#language'
        primary={t('Language')}
        icon={
          <FontAwesomeIcon style={{ fontSize: '1.5rem' }} icon={faLanguage} />
        }
      />
      <ListItemLink
        to='#theme'
        primary={t('Theme')}
        icon={<ThemeIcon style={{ fontSize: '1.5rem' }} />}
      />
    </>
  )
}

const MainMenuItems = translate('Menu')(MainMenuItemsUntranslated)

function SecondaryMenuItems () {
  return <>{/* <ListSubheader inset>Saved reports</ListSubheader> */}</>
}

export { MainMenuItems, SecondaryMenuItems }
