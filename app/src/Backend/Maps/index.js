import Common from '../Base/Common';
import cache from '../Base/Cache';

import MapDataStatic from './MapDataStatic';

// Handle data backend and cache for Maps
// This is not a singleton: unique error handlers
class MapDataHandler extends Common {
  // Visible backend name
  name = "Maps JSON Files";

  // Used to update the data at official schedule
  // Official schedule's at 10am. It often is some minutes later.
  // GH Pages cache backend Workflow schedule is at 10:30 and lasts few minutes (less than 5).
  // We schedule at 10:35
  timerDataUpdate = false;
  officialUpdateTime = "10:35".split(':');

  /*
     Return static data
  */
  static kinds  = ()     => Object.keys(MapDataStatic.kind);
  static values = (kind) => Object.keys(MapDataStatic.kind[kind].values);
  static svg    = (kind) => MapDataStatic.kind[kind].svg;

  static metadata = (values, meta) => MapDataStatic.metadata[values][meta];
  static metaColors = (values) => MapDataHandler.metadata(values, 'colors');
  static metaTitle  = (values) => MapDataHandler.metadata(values, 'title');
  static metaLabel  = (values) => MapDataHandler.metadata(values, 'label');
  static metaName   = (values) => MapDataHandler.metadata(values, 'name');

  /*
     Return dynamic data (with cache)
  */
  days = (callback) => cache.fetch( MapDataStatic.days, callback);
  data = (kind, values, callback) => cache.fetch( MapDataStatic.kind[kind].values[values], callback);

  /*
     Handle data update and cache invalidation
  */

  // Checks if `days` URL has updates
  // If HEAD request succeeds, calls callback with bool (`true` if update is needed)
  checkUpdate = (callback, onError = () => {}) => {
    cache.checkIfNeedUpdate(
      MapDataStatic.days,
      updateNeeded => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`${this.name}: update needed: ${updateNeeded}`);
        }
        callback(updateNeeded);
      },
      error => {
        console.error(`${this.name}: updating data from backend: `, error);
        onError(error);
      }
    );
  }

  // Updates all sources, sequentially
  updateAll = (callback) => {
    (async (callback) => {

      // Invalidate each map JSON first
      for(let kind of MapDataHandler.kinds()) {
        for(let value of MapDataHandler.values(kind)) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`Invalidate ${kind} - ${value}`);
          }
          await cache.invalidate( MapDataStatic.kind[kind].values[value] );
        };
      };
     
      // Finally, invalidate the `days` JSON
      if (process.env.NODE_ENV === 'development') {
        console.log(`Invalidate days`);
      }
      await cache.invalidate( MapDataStatic.days );

      callback(true);
    })(callback);
  }

  // Updates all sources if needed
  // Always calls callback with a boolean argument indicating if an update was made
  updateIfNeeded = (callback) => {
    this.checkUpdate( (updateNeeded) => {
      if (updateNeeded) {
        this.updateAll(() => callback(true));
      }
      else {
        callback(false);
      }
    });
  }

  // Cancels an ongoing timer for update
  cancelUpdateSchedule = () => {
    if ( this.timerDataUpdate ) {
      clearTimeout( this.timerDataUpdate );
    }
  }

  // Try to update data on next official scheduled data update
  scheduleNextUpdate = (millis = false, recursive = false) => {
    // If millis is not defined, call on next calculated default
    const nextMillis = millis === false
      ? this.millisToNextUpdate()
      : millis;

    if (process.env.NODE_ENV === 'development') {
      console.log(`Next update on ${new Date( (new Date()).getTime() + nextMillis )}`);
    }

    // If data has been updated and `recursive` is true, re-schedule data update for the next day
    // Else (recursive || not recursive but data NOT updated), schedule data update in 5 minutes
    // This way, we retry an update few minutes later, in case the schedule has lasted more than usual
    this.cancelUpdateSchedule(); // Just in case
    this.timerDataUpdate = setTimeout(
      () => this.updateIfNeeded(
        updated => recursive || !updated
          ? this.scheduleNextUpdate( updated ? false : 300_000)
          : false),
      nextMillis
    )
  }

  // Calculates haw many milliseconds until next schedulled update (today's or tomorrow)
  // TODO: Take care of timezones: Official date is in CEST/GMT+0200 (with daylight saving modifications), Date uses user's timezone and returns UTC
  //       Now, it only works if user timezone is CEST
  //       Probably, the best would be to translate both dates into UTC and, only then, compare them
  millisToNextUpdate = () => {
    const now = new Date();
    const todayDataSchedule = new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...this.officialUpdateTime, 0, 0);
    const millisTillSchedulle = todayDataSchedule - now;

    return millisTillSchedulle <= 0
      ? millisTillSchedulle + 86_400_000 // it's on or after today's schedule, try next schedule tomorrow.
      : millisTillSchedulle
  }
}

export default MapDataHandler;
