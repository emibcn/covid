import React from 'react';
import {
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import { translate } from 'react-translate'

class CloseModal extends React.PureComponent {
  constructor(props) {
    super();

    if ( !('history' in props) ||
         props.history.location.hash !== '' ) {
      global.setTimeout( () => props.history.push('#'), 10);
    }
  }

  render() {
    return null;
  }
};

class ModalRouterInner extends React.PureComponent {

  constructor(props) {
    super();

    // Set initial state
    this.history = props.history;
    this.state = {
      ...this.getPathState(props.location),
      autoForce: false,
      forced: props.force,
    };
  }

  getPathState(location) {
    const path = location.hash.replace(/[^#]*#(.*)$/, '$1');
    return {
      modalIsOpen: !!path.length && path !== 'close',
      path,
      initialPath: this.state ? this.state.initialPath : path,
    };
  }

  componentDidMount() {
    // Register history change event listener
    this.unlisten = this.history.listen(this.handleHistoryChange);
  }

  componentWillUnmount() {
    // Unregister history change event listener
    this.unlisten();
    if ( this.timer ) {
      global.clearTimeout( this.timer );
    }
  }

  // Force user to different URLs
  componentDidUpdate(prevProps, prevState) {

    // Remember old URL when forcing
    if ( this.props.force !== false &&
         this.props.force !== prevProps.force &&
         this.state.forced !== this.props.force ) {
      this.setState({ forced: this.props.force });
    }

    // Clear autoForce after it has been forced
    if ( this.state.autoForce === this.state.path ) {
      this.setState({ autoForce: false });
    }

    // Force old modal after forcing another (do auto force)
    if ( prevState.path === this.state.forced &&
         prevState.path !== this.state.path &&
         this.state.initialPath !== false &&
         this.state.initialPath.length > 1 &&
         this.state.autoForce !== this.state.initialPath ) {
      this.setState({ autoForce: this.state.initialPath });
    }
  }

  openModal = () => this.setState({ modalIsOpen: true });

  closeModal = (propsClose={}) => {
    if ( !('history' in propsClose) ||
         propsClose.history.location.path !== '' ) {

      if(!this.timer) {
        this.timer = global.setTimeout( () => {
          this.history.push('#');
          this.timer = undefined;
        }, 10);
      }
    }
  }

  handleHistoryChange = (location, action) => {
    const state = this.getPathState(location);
    this.setState(state);
  }

  render() {
    const { children, initializing, force, fullScreen, t } = this.props;
    const { autoForce, path, forced } = this.state;

    if ( initializing ) {
      return null;
    }

    // Redirect to forced URL
    if ( force !== false && force !== path ) {
      return <Redirect push to={{ hash: force }} />;
    }

    // If previously have been forced when showing a modal,
    // force to go back there once the forced has been visited
    if (  autoForce !== false &&
          autoForce !== path &&
          forced !== path ) {
      return <Redirect push to={{ hash: autoForce }} />;
    }

    return (
      <Dialog
        open={ this.state.modalIsOpen }
        onClose={ this.closeModal }
        /* Be fullsreen on `sm` sreens */
        fullScreen={ fullScreen }
        aria-labelledby={ 'modal_heading' }
        aria-describedby={ 'modal_description' }
      >
        <DialogContent>
          <Switch location={ { pathname: path } } >
          
            { children }
          
            {/* Close modal if nothing is shown */}
            <Route render={ props => <CloseModal { ...props } /> } />
          </Switch>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={ this.closeModal } color="primary">
            { t("Close") }
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

// Get fullScreen prop using MediaQuery
const withFullScreen = (Component) => {
  return (props) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    return <Component { ...props } fullScreen={ fullScreen } />
  }
};

const ModalRouterInnerWithClasses = withFullScreen( ModalRouterInner );

class ModalRouter extends React.PureComponent {
  render() {
    const { children, ...rest } = this.props;
    return (
      <Route
        path=':path(.*)'
        render={ props => <ModalRouterInnerWithClasses { ...{ children, ...rest, ...props } } /> }
      />
    );
  }
}

export default translate('ModalRouter')(ModalRouter);
