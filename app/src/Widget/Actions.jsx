import React from 'react';
import PropTypes from 'prop-types';

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
import ErrorCatcher from '../ErrorCatcher';

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
    // Get `restProps` for child renders (including `id`)
    const { sections, fullScreen, t, ...restProps } = this.props;
    const { id } = this.props;
    // Get shortcut to content & title render functions
    const Content = open ? sections[open].render : () => {};
    const Title = open ? sections[open].title : () => {};
    return (
      <>
        <WidgetMenu
          options={ sections }
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
            >
              <DialogTitle style={{ cursor: 'move' }} id={ `draggable-dialog-title-${id}-${open}` }>
                <Title { ...restProps } t={ t } />
              </DialogTitle>
              <DialogContent>
                <ErrorCatcher origin={`${t('Widget')} ${open} ${Title({...restProps, t})}`}>
                  <Content { ...restProps } t={ t } />
                </ErrorCatcher>
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={ this.handleClose } color="primary">
                  { t("Close") }
                </Button>
              </DialogActions>
            </Dialog>
          ) : null
        }
      </>
    )
  }
}

const DraggableResponsiveDialog = translate('Widget')(DraggableResponsiveDialogUntranslated);

DraggableResponsiveDialog.propTypes = {
  id: PropTypes.string.isRequired,
  // [sectionID('view','edit','legend',...)]: {icon: string, label: string/fn }
  sections: PropTypes.object.isRequired,
};

// Get fullScreen prop using MediaQuery
const withFullScreen = (Component) => {
  return (props) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    return <Component { ...props } fullScreen={ fullScreen } />
  }
};

export default withFullScreen(DraggableResponsiveDialog);
