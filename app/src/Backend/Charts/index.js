import Common from '../Base/Common';
import cache from '../Base/Cache';

const ChartStaticHost = process.env.REACT_APP_CHART_STATIC_HOST;
const ChartDataStaticURL = `${ChartStaticHost}/index.json`;
const ChartDataBase = `${ChartStaticHost}/chart.json`;

// TODO: Abstract a layer to share with GitHub Maps

// Handle data backend and cache for Charts
// This is not a singleton: unique error handlers
class ChartDataHandler extends Common {
  // Visible backend name
  name = "Charts JSON Files";

  // Used to update the data at official schedule
  // Official schedule's at 10am. It often is some minutes later.
  // GH Pages cache backend Workflow schedule is at 10:30 and lasts few minutes (less than 5).
  // We schedule at 10:35
  timerDataUpdate = false;
  officialUpdateTime = "10:35".split(':');

  /*
     Return processed data
  */
  divisions = [];
  populations = [];

  constructor(index) {
    super();

    if (index) {
      this.parseIndex(index);
    }
    else {
      this.index( this.parseIndex );
    }
  }

  /*
     Return dynamic data (with cache)
  */
  indexData = [];
  index = (callback) => {
    return cache.fetch( ChartDataStaticURL, callback );
  }

  parseIndex = (index) => {
    // Get a unique (`[...new Set( )]`) list of options elements
    this.divisions = [...new Set( index.map( ({territori}) => territori) )];
    this.populations = [...new Set( index.map( ({poblacio})  => poblacio ) )];

    // Save/cache index data
    this.indexData = index;
  }

  // Active URLs: those which will be invalidated on update
  active = [];

  // Gets the breadcrumb of ancestors and the found node, or empty array (recursive)
  findBreadcrumb = (node, value, compare = (node, url) => node.url === url) => {
    if ( compare(node, value) ) {
      return [node]
    }
    else if ('children' in node) {
      for(const child of node.children) {
        const found = this.findBreadcrumb(child, value, compare);
        if (found.length) {
          return [...found, node]
        }
      }
    }
    return []
  }

  // Find a node in a tree
  findChild = (node, value, compare) => {
    const list = this.findBreadcrumb(node, value, compare);
    if (list.length) {
      return list[0];
    }
  }

  // Find division/population section
  findInitialNode = (division, population) => {
    return this.indexData.find(
      (link) =>
        link.territori === division &&
        link.poblacio === population
    );
  }

  // Fetch JSON data and subscribe to updates
  data = (division, population, url, callback) => {
    const initialLink = this.findInitialNode(division, population);

    // If found (why should it not?)
    if ( initialLink ) {

      // Find region name in link and children, recursively
      const found = this.findChild(initialLink, url);

      // TODO: We should do something else on error
      if (!found) {
        console.warn(`Could not find data in index: ${division}/${population}/${url}`, {initialLink, index: this.indexData});
        callback(false);
        return () => {};
      }

      // Add URL to active ones. Will be invalidated on update 
      if ( !(this.active.includes(found.url)) ) {
        this.active.push(found.url);
      }

      // Get URL content (download or cached)
      return cache.fetch( `${ChartDataBase}%3F${found.url}`, callback );
    }

    console.warn(`Could not find initial node in index: ${division}/${population}/${url}`, {initialLink, index: this.indexData});
    callback(false);
    return () => {};
  }

  /*
     Handle data update and cache invalidation
  */

  // Checks if `index` URL has updates
  // If HEAD request succeeds, calls callback with bool (`true` if update is needed)
  checkUpdate = (callback, onError = () => {}) => {
    cache.checkIfNeedUpdate(
      ChartDataStaticURL,
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

      // Invalidate each active JSON first
      for(const url of this.active) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Charts: Invalidate '?${url}'`);
        }
        await cache.invalidate( `${ChartDataBase}?${url}` );
      }
     
      // Finally, invalidate the `index` JSON
      if (process.env.NODE_ENV === 'development') {
        console.log(`Charts: Invalidate index`);
      }
      await cache.invalidate( ChartDataStaticURL );

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

export default ChartDataHandler;
