import React from 'react';

import Loading from '../Loading';

import { withMapsDataHandler } from '../Backend/Maps/MapsContext';
import { withChartsDataHandler } from '../Backend/Charts/ChartsContext';
import { withBcnDataHandler } from '../Backend/Bcn/BcnContext';

const noop = () => {};

class IndexesHandler extends React.Component {

  constructor(props) {
    super(props);

    this.backends = ['mapsDataHandler', 'chartsDataHandler', 'bcnDataHandler']
      .map( backendProp => ({
        initializer: props[backendProp],
        state: backendProp,
        unsubscribe: noop,
      }));

    // Initialize to null an index state for each backend
    this.state = this.backends
      .map( ({state}) => state)
      .reduce( (acc, state) => {
        acc[state] = null;
        return acc;
      }, {})
  }

  onBeforeIndexUpdate = (backend, updated) => {
    console.log(`Looking for an update of backend ${backend}`);
  }

  onAfterIndexUpdate = (backend, updated) => {
    console.log(`The update of the backend ${backend} was${updated ? '' : ' not'} done`);
  }

  // Fetch data once mounted
  componentDidMount() {
    this.backends.forEach( (backend) => {
      // Instantiate the handler
      backend.handler = new backend.initializer();

      // Subscribe to index updates
      // Save unsubscriber
      backend.unsubscribe = backend.handler.index( index => {
        this.setState({ [backend.state]: index });

        // Once data has been fetched, schedule next data update
        // Mind the timer on unmount
        backend.handler.scheduleNextUpdate();
      });
    });
  }

  // Cleanup side effects
  componentWillUnmount() {
    // Cancel next update timers and update subscriptions
    this.backends.forEach(
      (backend) => {
        if (backend.handler) {
          backend.handler.cancelUpdateSchedule();
          backend.unsubscribe();
        }
      }
    );
  }

  render() {
    // Get an array with all handled indexes values
    const indexes = this.backends
      .map( ({state}) => state)
      .map( state => this.state[state]);

    // KISS Loading
    return indexes.some( index => !index )
      ? <Loading />
      : this.props.children;
  }
}

// withMapsDataHandler: Add `mapsDataHandler` prop to use maps backend data
// withChartsDataHandler: Add `chartsDataHandler` prop to use charts backend data
// withBcnDataHandler: Add `bcnDataHandler` prop to use bcn backend data
export default
  withMapsDataHandler(
    withChartsDataHandler(
      withBcnDataHandler(
        IndexesHandler
  )));
