import React from "react";
import PropTypes from "prop-types";

import Loading from "../Loading";
import withDocumentVisibility from "../withDocumentVisibility";

import { withHandler as withMapsDataHandler } from "../Backend/Maps/context";
import { withHandler as withChartsDataHandler } from "../Backend/Charts/context";
import { withHandler as withBcnDataHandler } from "../Backend/Bcn/context";

import Provider from "./Provider";

// Initially downloads all backends indexes
// - Shows <Loading/> while data is downloading
// - Handles data updates:
//   - Continue using old data while updating: don't show <Loading/> again
//     TODO: Instead, execute prop callback to let the app know state changes,
//           so user can be adequatedly notified. Add local callbacks as arguments
//           to let the app/user cancel or force an update.
//   - Schedules next update as specified by each backend (as in ./Base/GHPages)
//     If a schedule has a "not updated yet" response, retry
//     updating after `milllisToNextUpdate` milliseconds (default: 5 minutes)
//   - If user is inactive (blur on tab or API Visibility hidden),
//     cancel  schedule (or don't launch at all if initially inactive)
//   - If user comes back, check if each backend needs an update and
//     schedule next update for each backend
// - Handles side effects on unmount:
//   - Clear schedule timers if they are active
//   - Unsubscribe to index updates. If listeners go down to 0 and there is an
//     ongoing download, it is automatically aborted by each backend handler.
class IndexesHandler extends React.Component {
  constructor(props) {
    super(props);

    // Create initial handled backends array
    this.backends = ["maps", "charts", "bcn"].map((name) => ({
      name,
      initializer: props[`${name}DataHandler`],
      state: `${name}DataHandler`,
      unsubscribe: () => {},
    }));

    // Initialize to null an index state for each backend
    this.state = this.backends.reduce((acc, { state }) => {
      acc[state] = null;
      return acc;
    }, {});
  }

  // TODO: Launch new notification
  //       App can show a notification with a <Loading> until onAfterUpdate
  //       Any callback would make sense?
  onBeforeUpdate = (backend) => {
    console.log(
      `onBeforeUpdate: Looking for an update of backend ${backend.handler.name}`
    );
  };

  // TODO: Launch new notification
  //       App can stop onBeforeUpdate <Loading /> and resolve to ok/ok depending on `updated`
  //       A retry callback can be passed to allow forcing another update
  onAfterUpdate = (backend, updated) => {
    console.log(
      `onAfterUpdate: The backend ${backend.handler.name} was${
        updated ? "" : " not"
      } updated`
    );
  };

  // Checks if we need to update it and, if so, do it
  updateIfNeeded = (backend) => {
    return new Promise((resolve) => {
      // If it has not yet been downloaded,
      // we definitively still don't need an update
      const now = new Date();
      if (
        this.state[backend.state] !== null &&
        !!backend.nextUpdateDate &&
        now > backend.nextUpdateDate
      ) {
        this.onBeforeUpdate(backend);
        backend.handler.updateIfNeeded((updated) => {
          this.onAfterUpdate(backend, updated);
          resolve(backend, updated);
        });
      } else {
        resolve(backend, false);
      }
    });
  };

  // Return a Promise resolved once all backends have updated if needed
  updateAllIfNeeded = () => Promise.all(this.backends.map(this.updateIfNeeded));

  // Schedules a backend update and saves its
  // due date into its `this.backends` object
  // TODO: Launch new notification
  //       App can show a `Next BD update at` notification
  //       A `force now` callback can be passed to allow forcing immediate update
  //       A `cancel` callback can be passed to allow cancelling the scheduled update
  scheduleNextUpdate = (backend) => {
    const { milllisToNextUpdate: notUpdatedMillis } = this.props;

    // Mind the timer on unmount
    // Use the date where needed
    backend.nextUpdateDate = backend.handler.scheduleNextUpdate({
      onBeforeUpdate: this.onBeforeUpdate.bind(this, backend),
      onAfterUpdate: this.onAfterUpdate.bind(this, backend),
      notUpdatedMillis,
    });
  };

  // Fetch data once mounted
  componentDidMount() {
    // Get `visible` status before the update: if it changes,
    // we will subscribe to update schedule in componentDidUpdate
    const { visible } = this.props;

    this.backends.forEach((backend) => {
      // Instantiate the handler
      backend.handler = new backend.initializer();

      // Subscribe to index updates
      // Save unsubscriber
      backend.unsubscribe = backend.handler.index((index) => {
        // Only on first download
        if (!this.state[backend.state]) {
          this.onAfterUpdate(backend, true);
        }

        // Save data into state
        this.setState({ [backend.state]: index });

        // Once data has been fetched, schedule next data update
        if (visible) {
          this.scheduleNextUpdate(backend);
        }
      });
    });
  }

  // Handle scheduled updates depending if user has the tab active or not
  componentDidUpdate = async (prevProps, prevState) => {
    const { visible } = this.props;
    if (visible !== prevProps.visible) {
      if (visible) {
        console.log("Update backends if needed");
        await this.updateAllIfNeeded();

        console.log("Schedule next indexes updates");
        this.backends.forEach(this.scheduleNextUpdate);
      } else {
        console.log("Cancel schedule of next indexes updates");
        this.backends.forEach(({ handler }) => handler.cancelUpdateSchedule());
      }
    }
  };

  // Cleanup side effects
  componentWillUnmount() {
    // Cancel next update timers and update subscriptions
    this.backends.forEach((backend) => {
      if (backend.handler) {
        backend.handler.cancelUpdateSchedule();
        backend.unsubscribe();
      }
    });
  }

  render() {
    // Get an array with all handled indexes values
    const indexes = this.backends
      .map(({ state }) => state)
      .map((state) => this.state[state]);
    const provided = this.backends.reduce(
      (acc, { name, handler }) => ({
        ...acc,
        [name]: handler,
      }),
      {}
    );

    // Show <Loading/> while some index has not yet been loaded
    return indexes.some((index) => !index) ? (
      <Loading />
    ) : (
      <Provider {...provided}>{this.props.children}</Provider>
    );
  }
}

IndexesHandler.defaultProps = {
  // Retry every 5 minuts after each "not updated yet" response
  milllisToNextUpdate: 300_000,
};

IndexesHandler.propTypes = {
  // Delay before retrying a schedule after a "not updated yet" response
  milllisToNextUpdate: PropTypes.number,
};

// withMapsDataHandler: Add `mapsDataHandler` prop to use maps backend data
// withChartsDataHandler: Add `chartsDataHandler` prop to use charts backend data
// withBcnDataHandler: Add `bcnDataHandler` prop to use bcn backend data
// withDocumentVisibility: Add `visible` boolean prop, telling wether the
//                         current browser tab is active or not
export default withMapsDataHandler(
  withChartsDataHandler(
    withBcnDataHandler(withDocumentVisibility(IndexesHandler))
  )
);
