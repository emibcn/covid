import React from 'react';

import { translate } from 'react-translate'

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'

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


// Renders the widget's popup actions menu
const WidgetMenu = (props) => {
  const { onClick, options, id, ...restProps } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // Sets the element where the popup menu will open next to
  const handleClickOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // When an element is clicked, close menu and call parent's onClick
  const handleClickElement = (value) => {
    handleClose();
    onClick(value);
  };

  // Render the open icon button and, if in open
  // state, the menu with all elements but `view`
  return (
    <div>
      <IconButton
        aria-label="widget actions"
        aria-controls={ `widget-menu-${ id }` }
        aria-haspopup="true"
        onClick={ handleClickOpen }
      >
        <FontAwesomeIcon icon={ faEllipsisV } />
      </IconButton>
      { anchorEl ? (
          <Menu
            id={ `widget-menu-${ id }` }
            anchorEl={ anchorEl }
            keepMounted
            open={ open }
            onClose={ handleClose }
            PaperProps={{
              style: {
                width: '20ch',
              },
            }}
          >
            { Object.keys(options)
              .filter( option => option !== 'view' )
              .map( option => (
                <WidgetMenuItem
                  key={ option }
                  option={ option }
                  onClick={ handleClickElement }
                  icon={ options[option].icon }
                  label={ typeof options[option].label === "function" ? options[option].label(restProps) : options[option].label }
                />
              ))
            }
          </Menu>
        ) : null
      }
    </div>
  );
}

export default translate('Widget')(WidgetMenu);
