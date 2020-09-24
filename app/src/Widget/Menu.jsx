import React from 'react';

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
  const handleClick = () => props.onClick(props.option);
  return (
    <MenuItem
      key={ props.option }
      onClick={ handleClick }
      ref={ ref }
    >
      <ListItemIcon>
        { props.icon }
      </ListItemIcon>
      <ListItemText primary={ props.label } />
    </MenuItem>
  )
});


// Renders the widget's popup actions menu
const WidgetMenu = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // Sets the element where the popup menu will open next to
  const handleClickOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // When an element is clicked, close menu and call parent's onClick
  const handleClickElement = (value) => {
    handleClose();
    props.onClick(value);
  };

  // Render the open icon button and, if in open
  // state, the menu with all elements but `view`
  return (
    <div>
      <IconButton
        aria-label="widget actions"
        aria-controls={ `widget-menu-${ props.id }` }
        aria-haspopup="true"
        onClick={ handleClickOpen }
      >
        <FontAwesomeIcon icon={ faEllipsisV } />
      </IconButton>
      { anchorEl ? (
          <Menu
            id={ `widget-menu-${ props.id }` }
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
            { Object.keys(props.options)
              .filter( option => option !== 'view' )
              .map( option => (
                <WidgetMenuItem
                  key={ option }
                  option={ option }
                  onClick={ handleClickElement }
                  icon={ props.options[option].icon }
                  label={ props.options[option].label || option }
                />
              ))
            }
          </Menu>
        ) : null
      }
    </div>
  );
}

export default WidgetMenu;
