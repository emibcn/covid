import React from 'react';

import Loading from '../Loading';

import { withMapsDataHandler } from '../Backend/Maps/MapsContext';
import { withChartsDataHandler } from '../Backend/Charts/ChartsContext';
import { withBcnDataHandler } from '../Backend/Bcn/BcnContext';

const noop = () => {};

class IndexesHandler extends React.Component {
  state = {
    days: null,
    chartsIndex: null,
    bcnIndex: null,
  }

  constructor(props) {
    super(props);

    this.bcnData = new props.bcnDataHandler();
    this.chartsData = new props.chartsDataHandler();
    this.mapData = new props.mapsDataHandler();

    const { mapData, chartsData, bcnData } = this;
    this.backends = [
      {
        handler: mapData,
        state: 'days',
        unsubscribe: noop,
      },
      {
        handler: chartsData,
        state: 'chartsIndex',
        unsubscribe: noop,
      },
      {
        handler: bcnData,
        state: 'bcnIndex',
        unsubscribe: noop,
      },
    ];
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
        backend.handler.cancelUpdateSchedule();
        backend.unsubscribe();
      }
    );
  }

  render() {
    // KISS Loading
    const { days, chartsIndex, bcnIndex } = this.state;

    return ( !days || !chartsIndex || !bcnIndex )
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
