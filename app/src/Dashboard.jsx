import React from "react";

import clsx from "clsx";
import { translate } from "react-translate";

import { makeStyles, createTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import MenuIcon from "@material-ui/icons/Menu";
import Badge from "@material-ui/core/Badge";
/*
import NotificationsIcon from '@material-ui/icons/Notifications';
*/

import Menu from "./Menu";
import ModalRouterWithRoutes from "./ModalRouterWithRoutes";
import AppThemeProvider from "./AppThemeProvider";
import {
  withServiceWorkerUpdater,
  LocalStoragePersistenceService,
} from "@3m1/service-worker-updater";

const Copyright = translate("Copyright")((props) => {
  const { t } = props;
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/emibcn/covid">
        {t("Source code of:")}{" "}
        <em>
          {t("Covid Data")} <code>{t("Refactored")}</code>
        </em>
      </Link>{" "}
      {new Date().getFullYear()}.
    </Typography>
  );
});

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

const Dashboard = (props) => {
  const classes = useStyles();
  const { children, theme, t, ...restProps } = props;
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const shouldShowUpdateBadge =
    useMediaQuery(createTheme().breakpoints.down("md")) &&
    props.newServiceWorkerDetected;

  return (
    <AppThemeProvider type={theme}>
      <ModalRouterWithRoutes routeProps={props} />
      <div id="root" className={classes.root}>
        <AppBar
          position="absolute"
          className={clsx(classes.appBar, open && classes.appBarShift)}
        >
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open menu"
              data-testid="open-menu"
              onClick={handleDrawerOpen}
              className={clsx(
                classes.menuButton,
                open && classes.menuButtonHidden
              )}
            >
              <Badge
                badgeContent={1}
                color="secondary"
                invisible={!shouldShowUpdateBadge}
              >
                <MenuIcon />
              </Badge>
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              {t("Covid Data")} <code>{t("Refactored")}</code>
            </Typography>
            {/*
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            */}
          </Toolbar>
        </AppBar>
        <Menu
          {...{ handleDrawerOpen, handleDrawerClose, open }}
          {...restProps}
        />
        <main className={classes.content}>
          {children}
          <Container maxWidth="lg" className={classes.container}>
            <Box pt={4}>
              <Copyright />
            </Box>
          </Container>
        </main>
      </div>
    </AppThemeProvider>
  );
};

export default translate("Widget")(
  withServiceWorkerUpdater(Dashboard, {
    persistenceService: new LocalStoragePersistenceService("CovidRefactored"),
  })
);
export { Copyright };
