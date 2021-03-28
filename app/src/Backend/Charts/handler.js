import GHPages from '../Base/GHPages';
import cache from '../Base/Cache';

const ChartStaticHost = process.env.REACT_APP_CHART_STATIC_HOST ?? "https://emibcn.github.io/covid-data/Charts";
const ChartDataStaticURL = `${ChartStaticHost}/index.json`;
const ChartDataBase = `${ChartStaticHost}/chart.json`;

// Handle data backend and cache for Charts
// This is not a singleton: unique error handlers
class ChartDataHandler extends GHPages {

  // Visible backend name
  name = "Charts JSON Files";
  indexUrl = ChartDataStaticURL;
  unsubscribeIndex = () => {};

  /*
     Processed data from index
  */
  divisions = [];
  populations = [];

  // If index data is not passed, subscribe to index
  // URL and parse its content once downloaded
  constructor(index) {
    super();

    if (index) {
      this.parseIndex(index);
    }
    else {
      this.unsubscribeIndex = this.indexInternal( this.parseIndex );
    }
  }

  /*
     Return dynamic data (with cache)
  */
  indexData = [];
  indexInternal = (callback) => cache.fetch( ChartDataStaticURL, callback );

  // Return unsubscription callback
  // If automatic index download was done (in constructor),
  // unsubscribe also from it
  index = (callback) => {
    const unsubscribe = this.indexInternal( callback );
    return () => {
      unsubscribe();
      this.unsubscribeIndex();
    }
  }

  parseIndex = (index) => {
    // Get a unique (`[...new Set( )]`) list of options elements
    this.divisions =   [...new Set( index.map( ({territori}) => territori) )];
    this.populations = [...new Set( index.map( ({poblacio})  => poblacio ) )];

    // Save/cache index data
    this.indexData = index;

    // Update active downloads
    this.invalidateAll();
  }

  // Active URLs: those which will be invalidated on update
  active = [];

  getURL = (url) => `${ChartDataBase}${encodeURIComponent(`?${url}`)}`;

  // Invalidate all URLs, except index
  invalidateAll = async () => {
    for (const url of this.active) {
      this.log(`${this.name}: Invalidate '?${url}'`);
      await cache.invalidate( this.getURL(url) );
    }
  }

  // Gets the breadcrumb of ancestors and the found node, or empty array (recursive)
  findBreadcrumb = (node, value, compare = (node, url) => node.url === url) => {
    if (compare(node, value)) {
      return [node]
    }
    else if ('children' in node) {
      for (const child of node.children) {
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

  find = (division, population, url) => {
    const initialLink = this.findInitialNode(division, population);
    return this.findChild(initialLink, url);
  }

  // Used to fix region when changing main options.
  // TODO: Find a better way. ID by breadcrumb?
  findRegion = (division, population, region) => {
    const initialNode = this.findInitialNode(division, population);
    const found = this.findChild(initialNode, region);

    if ( !found ) {
      // Try to find in the other valid initialNodes (same division)
      const nodes = this.indexData.filter( (node) =>
        division === node.territori &&
        population !== node.poblacio
      );
      for (const node of nodes ) {
        // Look for region in the other initialNode
        const f1 = this.findChild(node, region);
        // If found, find in our initialNode for a region with the same name
        const f2 = f1 && this.findChild(
          initialNode,
          f1.name,
          (node, name) => node.name === name);
        // If found, use it
        if (f2) {
          return f2;
        }
      }

      // Not found in valid initialNodes: default to actual initialNode's root
      return initialNode;
    }

    // Found!
    return found;
  }

  // Fetch JSON data and subscribe to updates
  data = (division, population, url, callback) => {

    const initialLink = this.findInitialNode(division, population);

    // If found (why should it not?)
    if (initialLink) {

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
      return cache.fetch(this.getURL(found.url), callback);
    }

    console.warn(`Could not find initial node in index: ${division}/${population}/${url}`, {initialLink, index: this.indexData});
    callback(false);
    return () => {};
  }
}

export default ChartDataHandler;
