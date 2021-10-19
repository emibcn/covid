import React from "react";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";

import { translate } from "react-translate";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
/*
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
*/
import ThemeIcon from "@material-ui/icons/Brightness4";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle as faAbout,
  faLanguage,
} from "@fortawesome/free-solid-svg-icons";

const ListItemLink = (props) => {
  const { icon, primary, to } = props;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to]
  );

  return (
    <li>
      <ListItem button component={renderLink}>
        {icon ? (
          <Tooltip title={primary}>
            <ListItemIcon>{icon}</ListItemIcon>
          </Tooltip>
        ) : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
};

ListItemLink.propTypes = {
  icon: PropTypes.element,
  primary: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

const MainMenuItems = translate("Menu")((props) => {
  const { t } = props;
  return (
    <>
      {/* <ListItemLink to="/" primary={ "Dashboard" } icon={ <DashboardIcon /> } /> */}
      <ListItemLink
        to="#about"
        primary={t("About...")}
        icon={<FontAwesomeIcon style={{ fontSize: "1.5rem" }} icon={faAbout} />}
      />
      <ListItemLink
        to="#language"
        primary={t("Language")}
        icon={
          <FontAwesomeIcon style={{ fontSize: "1.5rem" }} icon={faLanguage} />
        }
      />
      <ListItemLink
        to="#theme"
        primary={t("Theme")}
        icon={<ThemeIcon style={{ fontSize: "1.5rem" }} />}
      />
    </>
  );
});

const SecondaryMenuItems = (props) => {
  return <>{/* <ListSubheader inset>Saved reports</ListSubheader> */}</>;
};

export { MainMenuItems, SecondaryMenuItems, ListItemLink };
