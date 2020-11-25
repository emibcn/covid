import React from 'react';
import PropTypes from 'prop-types';

import ListHeader from './ListHeader';
import MenuAddWidget from './MenuAddWidget';
import WidgetsTypes from './Widgets';
import SortableWidgetContainer from './SortableWidgetContainer';

import { withBcnDataHandler } from '../Backend/Bcn/BcnContext';
import { withMapsDataHandler } from '../Backend/Maps/MapsContext';
import { withChartsDataHandler } from '../Backend/Charts/ChartsContext';

import Throtle from '../Throtle';
import DateSlider from './DateSlider';
import Loading from '../Loading';

import WidgetStorageContextProvider from './Storage/StorageContextProvider';
import withStorageHandler from './Storage/withStorageHandler';

// GUID generator: used to create unique dtemporal IDs for widgets
const S4 = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1);
const guidGenerator = () => "a-"+S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4();

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

    mapData.days( days => {
      // Are we on the last time serie element before update?
      const {current, days: daysOld} = this.state;
      const isLast = !current || !daysOld || current === daysOld.length - 1;

      this.setState({
        days,

        // If we were on last item, go to the new last
        ...(isLast ? {current: days.length - 1} : {}) 
      });

      // Once data has been fetched, schedule next data update
      // Mind the timer on unmount
      mapData.scheduleNextUpdate();
    });
    chartsData.index( chartsIndex => {

      this.setState({ chartsIndex });

      // Once data has been fetched, schedule next data update
      // Mind the timer on unmount
      chartsData.scheduleNextUpdate();
    });
    bcnData.index( bcnIndex => {
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

  // Handle widgets reordering
  // Takes care of both `this.widgetsIds` and `this.props.widgets`
  onReorder = (oldIndex, newIndex) => {
    // Reorder ID
    const id = this.widgetsIds[oldIndex];
    this.widgetsIds.splice(oldIndex, 1);
    this.widgetsIds.splice(newIndex, 0, id);

    // Reorder data (keep props immutable)
    // Use `widgets.filter` to clone original array
    const { widgets } = this.props;
    const widget = widgets[oldIndex];
    const widgetsNew = widgets.filter((w, index) => index !== oldIndex);
    widgetsNew.splice(newIndex, 0, widget);

    // Save data
    return this.props.onChangeData({ widgets: widgetsNew });
  }

  render() {

    // KISS Loading
    if ( !this.state.days || !this.state.chartsIndex ) {
      return <Loading />;
    }

    const { widgets } = this.props;
    const { days, chartsIndex, bcnIndex, current } = this.state;

    return (
      <>
        <ListHeader>
          {/* Add an item */}
          <MenuAddWidget
            onAdd={ this.onAdd }
            options={ WidgetsTypes }
          />

          {/* Days display & Current manager */}
          <DateSlider
            days={ days }
            current={ current || 0 }
            onSetDate={ this.onSetDate }
          />
        </ListHeader>

        {/* Container that displays the widgets */}
        <SortableWidgetContainer 
          bcnIndex={bcnIndex}
          chartsIndex={chartsIndex}
          days={days}
          indexValues={current}
          onChangeData={this.onChangeData}
          onRemove={this.onRemove}
          onReorder={this.onReorder}
          widgets={widgets}
          widgetsIds={this.widgetsIds}
        />
      </>
    );
  }
}

WidgetsList.propTypes = {
  widgets: PropTypes.array.isRequired,
  onChangeData: PropTypes.func.isRequired,
};

// withStorageHandler: Handle params from storage providers (route + localStorage) into props
// withStyles: Add `classes` prop for styling components
// withBcnDataHandler: Add `bcnDataHandler` prop to use bcn backend data
// withMapsDataHandler: Add `mapsDataHandler` prop to use maps backend data
// withChartsDataHandler: Add `chartsDataHandler` prop to use charts backend data
const WidgetsListWithHOCs =
  withStorageHandler(
    withBcnDataHandler(
      withMapsDataHandler(
        withChartsDataHandler(
          WidgetsList
  ))));

// Manage some context providers details:
// - pathFilter: How to split `location` (Route `path` prop)
// - paramsFilter: Parse `location` parts defined ^
// - paramsToString: Parse back a JS object into a `location` path
const WidgetsListWithStorageContextProviders = (props) => (
  <WidgetStorageContextProvider
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
    <WidgetsListWithHOCs { ...props } />
  </WidgetStorageContextProvider>
);

export default WidgetsListWithStorageContextProviders;
