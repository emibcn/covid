import React from 'react';
import PropTypes from 'prop-types';

import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons'

import MapData from '../Backend/Maps';
import MapWidget from './Map';

import Throtle from '../Throtle';
import Slider from '../Slider';
import Loading from '../Loading';

import WidgetDataContextProvider from './DataContextProvider'; 
import withPropHandler from './withPropHandler';

const S4 = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1);
const guidGenerator = () => "a-"+S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4();

const useStyles = (theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  widgetsContainer: {
    zIndex: 10,
    width: '100%',
    margin: 0,
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixed: {
    position: 'sticky',
    top: 0,
    zIndex: 1,
    padding: 0,
    marginBottom: theme.spacing(2),
  },
  sliderContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1),
  },
  addButton: {
    fontSize: theme.spacing(4),
    padding: 0,
  },
});

// Renders widgets list
// - Manages days list (using backend) and current selected day with a Slider
// - Receives managed plugins params from props (with context providers and consumer)
// - Receives Widgets param events and calls parents param event
//   handlers callbacks with processed data:
//   - Add
//   - Edit
//   - Remove
// - Blindly handles different types of widgets depending on passed pramas from URL or localStorage
class WidgetsList extends React.PureComponent {

  // Managed data: days & currently selected day
  state = {
    days: null,
    current: null,
  }

  // Widgets list temporal IDs
  // Used to maintain widget uniqueness during a session
  widgetsIds = [];

  // Used in the slider to prevent blocking the UI
  // with excessive calls on mouse move
  throtle = new Throtle();

  // Map Data backend
  // TODO: Handle errors
  MapData = new MapData();

  constructor(props) {
    super(props);
    // Generate initial list of unique IDs
    if ('widgets' in props) {
      this.updateIDs(props.widgets.length);
    }
  }

  // Fetch data once mounted
  componentDidMount() {
    this.MapData.days(
      days => {
        // Are we on the last time serie element before update?
        const isLast =
          !this.state.current ||
          !this.state.days ||
          this.state.current === this.state.days.length - 1;

        this.setState({
          days,
          // If we were on last item, go to the new last
          ...(isLast ? {current: days.length - 1} : {}) 
        });

        // Once data has been fetched, schedule next data update
        // Mind the timer on unmount
        this.MapData.scheduleNextUpdate();
      });
  }

  // Cleanup side effects
  componentWillUnmount() {
    // Cancel next update timer
    this.MapData.cancelUpdateSchedule();
    // Cancel possible throtle timer
    this.throtle.clear();
  }

  updateIDs = (length) => {
    // Ensure all widgets have ID
    while ( this.widgetsIds.length < length ) {
      this.widgetsIds.push( guidGenerator() );
    }
  }

  componentDidUpdate() {
    this.updateIDs(this.props.widgets.length);
  }

  // Slider helpers
  onSetDate = (event, current) => this.throtle.run(false, 10, () => this.setState({ current }) );
  sliderTipFormatter = value => this.state.days[value];

  // Probably should go anywhere else
  widgetType = {
    map: MapWidget
  }

  // Adds a new default widget to the list
  onAdd = () => {
    const widgets = [...this.props.widgets];
    widgets.push({ type: 'map' });
    this.updateIDs(widgets.length);
    return this.props.onChangeData({ widgets });
  }

  // Handle onRemove event from widget
  // Function creator to cache the widget position
  // Calls parent' onChangeData to save the data
  onRemove = id => {
    const widgets = this.props.widgets.filter( (w,index) => this.widgetsIds[index] !== id);
    this.widgetsIds = this.widgetsIds.filter( idElement => idElement !== id);
    return this.props.onChangeData({ widgets });
  }

  // Handle onChangeData event from widget
  // Function creator to cache the widget position
  // Calls parent' onChangeData to save the data
  onChangeData = (id, data) => {
    const { widgets } = this.props;
    const widgetsNew = widgets.map( (w,i) => ({ ...w, ...(id === this.widgetsIds[i] ? {payload: data} : {} ) }) )
    return this.props.onChangeData({ widgets: widgetsNew });
  }

  render() {

    // KISS Loading
    if ( !this.state.days ) {
      return <Loading />;
    }

    const { widgets, classes } = this.props;
    const { days, current } = this.state;
    const fixedPaper = clsx(classes.paper, classes.fixed);

    return (
      <>
        <Paper className={fixedPaper}>
          <div className={classes.appBarSpacer} />
          <div className={classes.sliderContainer} >
            {/* Add an item */}
            <Button
              onClick={ this.onAdd }
              color="primary"
              aria-label="add" 
              className={classes.addButton}
            >
              <FontAwesomeIcon icon={ faPlusSquare } />
            </Button>

            {/* Days display & Current manager */}
            <Slider
              onChange={ this.onSetDate }
              value={ current || 0 }
              valueLabelFormat={ this.sliderTipFormatter }
              max={ days.length - 1 }
            />
          </div>
        </Paper>

        {/* Widgets container */}
        <Grid container spacing={3} className={classes.widgetsContainer}>
          {/* Widgets list */}
          { widgets.map( (widget, index) => {
              const WidgetComponent = this.widgetType[widget.type];
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={ this.widgetsIds[index] }>
                  <WidgetComponent
                    id={ this.widgetsIds[index] }
                    key={ this.widgetsIds[index] }
                    days={ days }
                    indexValues={ current }
                    onChangeData={ this.onChangeData }
                    onRemove={ this.onRemove }
                    { ...widget.payload }
                  />
                </Grid>
              )
            })
          }
        </Grid>
      </>
    );
  }
}

WidgetsList.propTypes = {
  widgets: PropTypes.array.isRequired,
  onChangeData: PropTypes.func.isRequired,
};

// withPropHandler: Handle params from providers (route + localStorage) into props
// - Here default/initial value: one map widget with default data
const WidgetsListWithPropHandler = withPropHandler( withStyles(useStyles)(WidgetsList) );

// Manage some context providers details:
// - pathFilter: How to split `location` (Route `path` prop)
// - paramsFilter: Parse `location` parts defined ^
// - paramsToString: Parse back a JS object into a `location` path
const WidgetsListWithContextProviders = (props) => (
  <WidgetDataContextProvider
    pathFilter={ '/:widgets*' }
    paramsFilter={ (params) => {
      const { widgets } = params;
      let widgetsParsed;

      try {
        widgetsParsed = widgets.split('/').map( w => JSON.parse(w) );
      } catch(err) {
        widgetsParsed = [];
      }

      return Object.assign({}, props, {
        widgets: widgetsParsed
      });
    }}
    paramsToString={ (params) => {
      const widgets = params.widgets.map( w => JSON.stringify({ type: w.type, payload: w.payload })).join('/');
      return `/${widgets}`
    }}
  >
    <WidgetsListWithPropHandler { ...props } />
  </WidgetDataContextProvider>
);

export default WidgetsListWithContextProviders;
