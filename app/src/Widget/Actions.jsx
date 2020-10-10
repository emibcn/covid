import React from 'react';

import { translate } from 'react-translate'

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import Draggable from 'react-draggable';

import WidgetMenu from './Menu';

class DraggableResponsiveDialogUntranslated extends React.PureComponent {

  /*
     Handle dialog open/close status
  */
  state = {
    open: false
  };

  // Set open status to the selected menu code
  handleClickOpen = (open) => {
    this.setState({ open });
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  render() {
    const { open } = this.state;
    const { id } = this.props;
    // Get `restProps` to child renders
    const { sections, fullScreen, t, ...restProps } = this.props;
    // Get shortcut to content & title render functions
    const Content = open ? sections[open].render : () => {};
    const Title = open ? sections[open].title : () => {};
    return (
      <div>
        <WidgetMenu
          options={ sections }
          id={ id }
          onClick={ this.handleClickOpen }
          { ...restProps }
        />
        {/* If open is not null, render the related dialog (opened) */}
        { open ? (
            <Dialog
              key={ open }
              open={ true }
              onClose={ this.handleClose }
              /* Allow dragging the dialog on non-small screens */
              { ...( fullScreen ? {} : {TransitionComponent: Draggable} ) }
              /* Be fullsreen on `sm` sreens */
              fullScreen={ fullScreen }
              aria-labelledby={ `draggable-dialog-title-${id}-${open}` }
              style={{ height: window.innerHeight }}
            >
              <DialogTitle style={{ cursor: 'move' }} id={ `draggable-dialog-title-${id}-${open}` }>
                <Title { ...restProps } t={ t } />
              </DialogTitle>
              <DialogContent>
                <Content { ...restProps } t={ t } />
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={ this.handleClose } color="primary">
                  { t("Close") }
                </Button>
              </DialogActions>
            </Dialog>
          ) : null
        }
      </div>
    )
  }
}

const DraggableResponsiveDialog = translate('Widget')(DraggableResponsiveDialogUntranslated);

// Get fullScreen prop using MediaQuery
const withFullScreen = (Component) => {
  return (props) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    return <Component { ...props } fullScreen={ fullScreen } />
  }
};

export default withFullScreen(DraggableResponsiveDialog);
