import GHPages from '../Base/GHPages';
import cache from '../Base/Cache';

import MapDataStatic from './MapDataStatic';

// Handle data backend and cache for Maps
// This is not a singleton: unique error handlers
class MapDataHandler extends GHPages {
  // Visible backend name
  name = "Maps JSON Files";

  // Overload "abstract" member
  indexUrl = MapDataStatic.days;

  // Used to update the data at official schedule
  officialUpdateTime = "10:35".split(':');

  // Invalidate all URLs, except index
  invalidateAll = async () => {
    // Invalidate each map JSON first
    for (const kind of MapDataHandler.kinds()) {
      for (const value of MapDataHandler.values(kind)) {
        this.log(`Invalidate ${kind} - ${value}`);
        await cache.invalidate( MapDataStatic.kind[kind].values[value] );
      };
    };
  }

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
}

export default MapDataHandler;
