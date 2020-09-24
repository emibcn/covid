import React from 'react';

import { translate } from 'react-translate'

import clsx from 'clsx';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import List from '@material-ui/core/List';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleUp as faUpgrade } from '@fortawesome/free-solid-svg-icons'

import { MainMenuItems, SecondaryMenuItems } from './MenuItems';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
}));

const MenuContent = translate('MainMenuItems')((props) => {
  const classes = useStyles();
  const { t } = props;
  return (
    <>
      <div className={ classes.toolbarIcon }>
        <IconButton
          edge="start"
          color="inherit"
          aria-label={ t("close menu") }
          onClick={ props.handleDrawerClose }
        >
          <MenuIcon />
        </IconButton>
        <Typography component="h1" variant="h6" color="inherit" noWrap className={ classes.title }>
          { t("Menu") }
        </Typography>
        <IconButton
          aria-label={ t("close menu") }
          onClick={ props.handleDrawerClose }
        >
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <List><MainMenuItems /></List>
      <Divider />
      <List><SecondaryMenuItems /></List>
    </>
  )
});

// Renders the menu, responsive
const Menu = translate('MainMenuItems')((props) => {
  const classes = useStyles();
  const { handleDrawerOpen, handleDrawerClose, open, newServiceWorkerDetected, t } = props;
  const theme = useTheme();
  const isBig = useMediaQuery(theme.breakpoints.up('md'));
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    if (open) {
      handleDrawerOpen();
    }
    else {
      handleDrawerClose();
    }
  };
  const DrawerComponent = isBig ? Drawer : SwipeableDrawer;
  
  const handleClickUpdate = (e) => {
    e.preventDefault();
    handleDrawerClose();
    props.onLoadNewServiceWorkerAccept();
  }
  const renderLink = (props) => {
    const { children, ...restProps } = props;
    return (
      <a
        href={ process.env.PUBLIC_URL }
        style={{ color: 'green' }}
        title={ t("New update available!") }
        onClick={ handleClickUpdate }
        { ...restProps }
      >
        { children }
      </a>
    )
  };
  return (
    <DrawerComponent
      { ...(isBig ? {
          variant: "permanent"
        } : {
          anchor: 'left',
          onClose: toggleDrawer(false),
          onOpen: toggleDrawer(true),
          disableBackdropTransition: !iOS,
          disableDiscovery: iOS,
        }) }
      classes={{
        paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
      }}
      open={ open }
    >
      <MenuContent handleDrawerClose={ handleDrawerClose } />
      { newServiceWorkerDetected ? (
          <ListItem button component={ renderLink }>
            <ListItemIcon><FontAwesomeIcon icon={ faUpgrade } style={{ fontSize: '1.5rem', color: 'green' }} /></ListItemIcon>
            <ListItemText primary={ t("Update!") } />
          </ListItem>
        ) : null
      }
    </DrawerComponent>
  )
});

export default Menu;
