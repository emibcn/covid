import Common from './Common';
import cache from './Cache';

// Handle data backend and cache for backends at GH Pages
// This is not a singleton: unique error handlers
class GHPages extends Common {
  // Visible backend name
  name = "GitHub Pages";

  // Used to update the data at official schedule
  // Official schedule's at 10am. It often is some minutes later.
  // GH Pages cache backend Workflow schedule is at 10:30 and lasts few minutes (less than 5).
  // We schedule at 10:35
  timerDataUpdate = false;
  officialUpdateTime = "10:35".split(':');

  indexUrl = ''; // Needs to be declared in extended classes

  /*
     Handle data update and cache invalidation
  */

  // Checks if `index` URL has updates
  // If HEAD request succeeds, calls callback with bool (`true` if update is needed)
  checkUpdate = (callback, onError = () => {}) => {
    return cache.checkIfNeedUpdate(
      this.indexUrl,
      async (updateNeeded) => {
        this.log(`${this.name}: update needed: ${updateNeeded}`);
        await callback(updateNeeded);
      },
      error => {
        console.error(`${this.name}: updating data from backend:`, error);
        onError(error);
      }
    );
  }

  // Invalidate all URLs, except index
  invalidateAll = async () => {
    console.warn(`${this.name}: Need to define abstract function 'invalidateAll'`);
    //await cache.invalidate( this.indexUrl );
  }

  // Updates all sources, sequentially
  updateAll = (callback) => {
    return (async (callback) => {

      // Invalidate each active JSON first
      await this.invalidateAll();

      // Finally, invalidate the `index` JSON
      this.log(`${this.name}: Invalidate index`);

      await cache.invalidate( this.indexUrl );

      callback(true);
    })(callback);
  }

  // Updates all sources if needed
  // Always calls callback with a boolean argument indicating if an update was made
  updateIfNeeded = (callback) => {
    return this.checkUpdate( async (updateNeeded) => {
      if (updateNeeded) {
        await this.updateAll(() => callback(true));
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

    this.log(`${this.name}: Next update on ${new Date( (new Date()).getTime() + nextMillis )}`);

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

export default GHPages;
