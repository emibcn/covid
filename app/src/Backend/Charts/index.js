import GHPages from '../Base/GHPages';
import cache from '../Base/Cache';

const ChartStaticHost = process.env.REACT_APP_CHART_STATIC_HOST ?? "https://emibcn.github.io/covid-data/Charts";
const ChartDataStaticURL = `${ChartStaticHost}/index.json`;
const ChartDataBase = `${ChartStaticHost}/chart.json`;

// TODO: Abstract a layer to share with GitHub Maps

// Handle data backend and cache for Charts
// This is not a singleton: unique error handlers
class ChartDataHandler extends GHPages {
  // Visible backend name
  name = "Charts JSON Files";
  indexUrl = ChartDataBase;

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

  // Invalidate all URLs, except index
  invalidateAll = async () => {
    for(const url of this.active) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`${this.name}: Invalidate '?${url}'`);
      }

      await cache.invalidate( `${ChartDataBase}?${url}` );
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
}

export default ChartDataHandler;
