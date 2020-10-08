import React from 'react';
import PropTypes from 'prop-types';

import { translate } from 'react-translate'

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons'

// Renders an item into the widget's popup actions menu
// Ensures click event uses widget id
const WidgetMenuItem = React.forwardRef((props, ref) => {
  const { onClick, option, icon, label} = props;
  const handleClick = () => onClick(option);
  return (
    <MenuItem
      key={ option }
      onClick={ handleClick }
      ref={ ref }
    >
      <ListItemIcon>
        { icon }
      </ListItemIcon>
      <ListItemText primary={ label || option } />
    </MenuItem>
  )
});

const MenuAddWidget = (props) => {
  const { t, onAdd, options } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // Sets the element where the popup menu will open next to
  const handleClickOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // When an element is clicked, close menu and call parent's onClick
  const handleClickElement = (value) => {
    handleClose();
    onAdd(value);
  };

  return (
    <div>
      <Tooltip title={ t("Add a graph") } aria-label={ t("add") }>
        <IconButton
          onClick={ handleClickOpen }
          color="primary"
          aria-label={ t("add") }
          aria-haspopup="true"
          className={ props.className }
        >
          <FontAwesomeIcon icon={ faPlusSquare } />
        </IconButton>
      </Tooltip>
      { anchorEl ? (
          <Menu
            id={ `widget-add-menu` }
            anchorEl={ anchorEl }
            keepMounted
            open={ open }
            onClose={ handleClose }
            transformOrigin={{
              vertical: 'center',
              horizontal: 'right',
            }}
            PaperProps={{
              style: {
                width: '30ch',
              },
            }}
          >
            { options.map( option => (
                <WidgetMenuItem
                  key={ option.key }
                  option={ option.key }
                  onClick={ handleClickElement }
                  icon={ option.icon }
                  label={ t(option.name) }
                />
              ))
            }
          </Menu>
        ) : null
      }
    </div>
  )
}

MenuAddWidget.propTypes = {
  onAdd: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.element.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default translate("MenuAddWidget")(MenuAddWidget);
