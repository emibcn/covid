import GHPages from '../Base/GHPages'
import cache from '../Base/Cache'

const BcnStaticHost =
  process.env.REACT_APP_BCN_STATIC_HOST ??
  'https://emibcn.github.io/covid-data/Bcn'
const BcnDataStaticURL = `${BcnStaticHost}/index.json`

// Handle data backend and cache for BCN
class BcnDataHandler extends GHPages {
  // Visible backend name
  name = 'Barcelona JSON Files'
  indexUrl = BcnDataStaticURL
  unsubscribeIndex = () => {}

  // If index data is not passed, subscribe to index
  // URL and parse its content once downloaded
  constructor (index) {
    super()

    if (index) {
      this.parseIndex(index)
    } else {
      this.unsubscribeIndex = this.indexInternal(this.parseIndex)
    }
  }

  /*
     Return dynamic data (with cache)
  */
  indexData = []
  indexInternal = (callback) => cache.fetch(BcnDataStaticURL, callback)

  // Return unsubscription callback
  // Return unsubscription from possible automatic download
  index = (callback) => {
    const unsubscribe = this.indexInternal(callback)
    return () => {
      unsubscribe()
      this.unsubscribeIndex()
    }
  }

  parseIndex = (index) => {
    // Save/cache index data
    this.indexData = index

    // Update active downloads
    this.invalidateAll()
  }

  // Active URLs: those which will be invalidated on update
  active = []

  // Invalidate all URLs, except index
  invalidateAll = async () => {
    for (const url of this.active) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`${this.name}: Invalidate '?${url}'`)
      }

      await cache.invalidate(`${BcnStaticHost}/${url}`)
    }
  }

  // Gets the breadcrumb of ancestors and the found node, or empty array (recursive)
  findBreadcrumb = (
    node,
    value,
    compare = ({ code }, value) => code === value
  ) => {
    if (node === null) {
      node = { sections: this.indexData }
    }
    if (compare(node, value)) {
      return [node]
    } else if ('sections' in node) {
      for (const child of node.sections) {
        const found = this.findBreadcrumb(child, value, compare)
        if (found.length) {
          return [...found, node]
        }
      }
    }
    return []
  }

  // Find a node in a tree
  findChild = (node, value, compare) => {
    const list = this.findBreadcrumb(node, value, compare)
    if (list.length) {
      return list[0]
    }
  }

  // Find division/population section
  findInitialNode = (dataset) => {
    return this.indexData.find(({ code }) => code === dataset)
  }

  // Return filtered index data values
  filter = (fn) => this.indexData.filter(fn)

  // Active URLs: those which will be invalidated on update
  active = []

  // Fetch JSON data and subscribe to updates
  data = (dataset, callback) => {
    // Find region name in link and children, recursively
    const found = this.findChild(null, dataset)

    // TODO: We should do something else on error
    if (!found) {
      console.warn(`Could not find data in index: ${dataset}`, {
        index: this.indexData
      })
      callback(false)
      return () => {}
    }

    // Add URL to active ones. Will be invalidated on update
    if (!this.active.includes(found.values)) {
      this.active.push(found.values)
    }

    // Get URL content (download or cached)
    // Return unsubscription callback
    return cache.fetch(`${BcnStaticHost}/${found.values}`, callback)
  }
}

export default BcnDataHandler
