import React from 'react';
import PropTypes from 'prop-types';

import clsx from 'clsx';

import { withStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import MenuAddWidget from './MenuAddWidget';
import WidgetsTypes from './Widgets';

import { withBcnDataHandler } from '../Backend/Bcn/BcnContext';
import { withMapsDataHandler } from '../Backend/Maps/MapsContext';
import { withChartsDataHandler } from '../Backend/Charts/ChartsContext';

import Throtle from '../Throtle';
import Slider from '../Slider';
import Loading from '../Loading';

import WidgetDataContextProvider from './DataContextProvider';
import withPropHandler from './withPropHandler';

// GUID generator: used to create unique dtemporal IDs for widgets
const S4 = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1);
const guidGenerator = () => "a-"+S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4();

// UI Material styles/classes
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
    zIndex: 1200,
    padding: 0,
    // Not using it, adds a scrolling slider to the container on some screens
    paddingBottom: 1,
  },
  sliderContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(.5),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    // Marks labels not shown under 'md'
    [theme.breakpoints.up('md')]: {
      marginBottom: theme.spacing(1),
      alignItems: 'flex-start',
    },
    // This is for non-mouse pointers, which need some extra space for usability
    // Not using it, adds a scrolling slider to the container on some screens
    // eslint-disable-next-line no-useless-computed-key
    ['@media (pointer: coarse)']: {
      [theme.breakpoints.up('md')]: {
        marginTop: theme.spacing(.5),
        paddingBottom: theme.spacing(1),
      },
      [theme.breakpoints.down('sm')]: {
        paddingBottom: theme.spacing(.1),
      },
    }
  },
  // Add some lateral space for the slider on larger displays
  sliderRoot: {
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.spacing(4),
      marginRight: theme.spacing(4),
    },
    [theme.breakpoints.down('md')]: {
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
    },
  },
  // Save some space in buttons for small devices
  addButton: {
    padding: 0,
    fontSize: theme.spacing(4),
    boxShadow: '3px 3px 5px 2px rgba(100, 100, 100, .3)',
    borderRadius: 3,
    [theme.breakpoints.up('md')]: {
      fontSize: theme.spacing(6),
    },
  },
  // Play/pause button uses special CSS, so it does the font sizing
  playPause: {
    fontSize: theme.spacing(4/2),
    [theme.breakpoints.up('md')]: {
      fontSize: theme.spacing(6/2),
    },
  },
});

// Renders widgets list
// - Manages days list (using backend) and current selected day with a Slider
// - Receives managed plugins params from props (with context providers and consumer)
// - Receives Widgets param modification events and calls parents param event
//   handlers callbacks with processed data:
//   - Add
//   - Edit
//   - Remove
// - Blindly (with `payload`) handles different types of widgets depending on passed/saved
//   params from URL and localStorage
class WidgetsList extends React.PureComponent {

  // Managed data: days & currently selected day
  state = {
    days: null,
    chartsIndex: null,
    bcnIndex: null,
    current: null,
    marks: [],
    marksSmall: [],
  }

  // Widgets list temporal IDs
  // Used to maintain widget uniqueness during a session
  widgetsIds = [];

  // Used in the slider to prevent blocking the UI
  // with excessive calls on mouse move
  throtle = new Throtle();

  constructor(props) {
    super(props);
    // Generate initial list of unique IDs
    if ('widgets' in props) {
      this.updateIDs(props.widgets.length);
    }

    this.bcnData = new props.bcnDataHandler();
    this.chartsData = new props.chartsDataHandler();
    this.mapData = new props.mapsDataHandler();
  }

  // Fetch data once mounted
  componentDidMount() {
    const { mapData, chartsData, bcnData } = this;

    mapData.days(
      days => {
        // Are we on the last time serie element before update?
        const isLast =
          !this.state.current ||
          !this.state.days ||
          this.state.current === this.state.days.length - 1;

        // Marks on the slider
        const marks = days
          // Remember index
          .map( (day, index) => ({day, index}))
          // Get first day of each month
          .filter( ({day, index}) => /^0?1\//.test(day) )
          // Map to Slider marks schema and remove initial `0`
          .map( ({day, index}) => ({ value: index, label: day.replace(/^0/, '') }) );

        this.setState({
          days,

          // Marks on the slider (small devices: no labels)
          marks,
          marksSmall: marks.map( ({value}) => ({value})),

          // If we were on last item, go to the new last
          ...(isLast ? {current: days.length - 1} : {}) 
        });

        // Once data has been fetched, schedule next data update
        // Mind the timer on unmount
        mapData.scheduleNextUpdate();
      });
      chartsData.index(
      chartsIndex => {

        this.setState({ chartsIndex });

        // Once data has been fetched, schedule next data update
        // Mind the timer on unmount
        chartsData.scheduleNextUpdate();
      });
      bcnData.index(
      bcnIndex => {
        this.setState({ bcnIndex });

        // Once data has been fetched, schedule next data update
        // Mind the timer on unmount
        bcnData.scheduleNextUpdate();
      });
  }

  // Cleanup side effects
  componentWillUnmount() {
    const { mapData, chartsData, bcnData } = this;

    // Cancel next update timers
    bcnData.cancelUpdateSchedule();
    chartsData.cancelUpdateSchedule();
    mapData.cancelUpdateSchedule();

    // Cancel possible throtle timer
    this.throtle.clear();
  }

  componentDidUpdate() {
    this.updateIDs(this.props.widgets.length);
  }

  // Ensure all widgets have ID
  updateIDs = (length) => {
    while ( this.widgetsIds.length < length ) {
      this.widgetsIds.push( guidGenerator() );
    }
  }

  // Slider helpers
  onSetDate = (event, current) => this.throtle.run(false, 10, () => this.setState({ current }) );
  sliderTipFormatter = value => this.state.days[value];

  // Adds a new default widget to the list
  onAdd = (widgetType) => {
    const widgets = [...this.props.widgets];
    widgets.push({ type: widgetType??'map' });
    this.updateIDs(widgets.length);
    return this.props.onChangeData({ widgets });
  }

  // Handle onRemove event from widget
  // Uses `this.widgetsIDs` for widget identification
  // Calls parent' onChangeData to save the data
  onRemove = id => {
    const widgets = this.props.widgets.filter( (w,index) => this.widgetsIds[index] !== id);
    this.widgetsIds = this.widgetsIds.filter( idElement => idElement !== id);
    return this.props.onChangeData({ widgets });
  }

  // Handle onChangeData event from widget
  // Calls parent' onChangeData to save the data
  onChangeData = (id, data) => {
    const { widgets } = this.props;
    const widgetsNew = widgets.map( (w,i) => ({ ...w, ...(id === this.widgetsIds[i] ? {payload: data} : {} ) }) )
    return this.props.onChangeData({ widgets: widgetsNew });
  }

  render() {

    // KISS Loading
    if ( !this.state.days || !this.state.chartsIndex ) {
      return <Loading />;
    }

    const { widgets, classes, showMarkLabels } = this.props;
    const { days, chartsIndex, bcnIndex, current, marks, marksSmall } = this.state;
    const fixedPaper = clsx(classes.paper, classes.fixed);

    return (
      <>
        <Paper className={ fixedPaper } elevation={ 2 }>
          {/* Space used by the App Bar fixed positioned */}
          <div className={ classes.appBarSpacer } />
          {/*
          <Container maxWidth="lg" className={classes.container}>
            <h3>HELLO WORLD!</h3>
          </Container>
          */}

          <div className={ classes.sliderContainer } >

            {/* Add an item */}
            <MenuAddWidget
              onAdd={ this.onAdd }
              className={ classes.addButton }
              options={ WidgetsTypes }
            />

            {/* Days display & Current manager */}
            <Slider
              classes={{
                root: classes.sliderRoot,
                playPause: classes.playPause,
              }}
              max={ days.length - 1 }
              value={ current || 0 }
              onChange={ this.onSetDate }
              valueLabelFormat={ this.sliderTipFormatter }
              getAriaValueText={ this.sliderTipFormatter }
              // Marks without labels for small screens
              marks={ showMarkLabels ? marks : marksSmall }
              // Always visible on small screens
              valueLabelDisplay={ showMarkLabels ? null : "on" }
            />
          </div>
        </Paper>

        {/* Widgets container */}
        <Grid container spacing={3} className={classes.widgetsContainer}>
          {/* Widgets list */}
          { widgets.map( (widget, index) => {
              const { Component } = WidgetsTypes.find(w => w.key === widget.type );
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={ this.widgetsIds[index] }>
                  <Component
                    id={ this.widgetsIds[index] }
                    key={ this.widgetsIds[index] }
                    days={ days }
                    chartsIndex={ chartsIndex }
                    bcnIndex={ bcnIndex }
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

// Get showMarkLabels prop using MediaQuery
// Used to prevent showing mark labels on small screens
const withShowMarkLabels = (Component) => {
  return (props) => {
    const theme = useTheme();
    const showMarkLabels = useMediaQuery(theme.breakpoints.up('md'));
    return <Component { ...props } { ...{ showMarkLabels } } />
  }
};

// withPropHandler: Handle params from providers (route + localStorage) into props
// withStyles: Add `classes` prop for styling components
// withShowMarkLabels: Add `showMarkLabels` breakpoint to sho/hide Slider mark labels depending on sreen size
// withBcnDataHandler: Add `bcnDataHandler` prop to use bcn backend data
// withMapsDataHandler: Add `mapsDataHandler` prop to use maps backend data
// withChartsDataHandler: Add `chartsDataHandler` prop to use charts backend data
const WidgetsListWithPropHandler =
  withPropHandler(
    withStyles(useStyles)(
      withShowMarkLabels(
        withBcnDataHandler(
          withMapsDataHandler(
            withChartsDataHandler(
              WidgetsList
  ))))));

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
        widgetsParsed = widgets.split('/').map( w => JSON.parse( decodeURIComponent(w) ) );
      } catch(err) {
        widgetsParsed = [];
      }

      return Object.assign({}, props, {
        widgets: widgetsParsed
      });
    }}
    paramsToString={ (params) => {
      const widgets = params.widgets.map(
        w => encodeURIComponent( JSON.stringify({ type: w.type, payload: w.payload }) )
      ).join('/');
      return `/${widgets}`
    }}
  >
    <WidgetsListWithPropHandler { ...props } />
  </WidgetDataContextProvider>
);

export default WidgetsListWithContextProviders;
