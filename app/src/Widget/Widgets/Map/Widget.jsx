import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faInfoCircle as faLegend,
  faEdit,
  faGlobeEurope as faMap
} from '@fortawesome/free-solid-svg-icons'

import MapData from '../../../Backend/Maps';
import { withData } from '../../../Backend/Maps/withHandlers';

import MapImage from './MapImage';
import Edit from './Edit';
import Legend from './Legend';
import withWidget from '../../Widget';

const MapWrapper = withWidget({
  // The normal view
  view: {
    icon: <FontAwesomeIcon icon={ faMap } />,
    label: ({ t }) => t("View"),
    title: (props) => props.name,
    render: withData(({t, mapKind, label, mapData, indexValues, colors, id}) => (
      <MapImage
        title={ `${t('Map')}: Catalunya: ${t(mapKind)}` }
        label={ label }
        values={ mapData.valors }
        mapSrc={ MapData.svg(mapKind) }
        indexValues={ indexValues }
        colors={ colors }
        id={ id }
      />
    )),
  },
  // Edit data
  edit: {
    icon: <FontAwesomeIcon icon={ faEdit } />,
    label: ({ t }) => t("Edit"),
    title: ({ t }) => t("Edit map parameters"),
    render: (props) => (
      <Edit
        mapKind={ props.mapKind }
        mapValue={ props.mapValue }
        onChangeMapKind={ props.onChangeMapKind }
        onChangeMapValue={ props.onChangeMapValue }
      />
    ),
  },

  // Show map legend
  legend: {
    icon: <FontAwesomeIcon icon={ faLegend } />,
    label: ({ t }) => t("Legend"),
    title: (props) => props.title,
    render: (props) => (
      <Legend
        colors={ props.colors }
        subtitle={ props.days[ props.indexValues ] }
      />
    ),
  },
});

/*
   Combine MapData backend with MapWrapper/MapImage
*/
class MapDataHandler extends React.Component {

  constructor(props) {
    super(props);

    // Default values: first element of each's group
    // TODO: Get data from storage/router/props
    const { mapKind, mapValue } = props;

    this.state = {
      mapKindDefault: mapKind,
      mapValueDefault: mapValue,
      ...this.getMeta(mapValue)
    }
  }

  // Get metadata from given params
  getMeta = (mapValue) => ({
    colors: MapData.metaColors(mapValue),
    title: MapData.metaTitle(mapValue),
    label: MapData.metaLabel(mapValue),
    name: MapData.metaLabel(mapValue),
  })

  // Update map metadata
  onChangeMapKind = (mapKind) => {
    const { mapValue } = this.props;
    this.props.onChangeData(
      this.props.id,
      {
        mapKind,
        mapValue
      });
  }

  // Update map metadata
  onChangeMapValue = (mapValue) => {
    const { mapKind } = this.props;
    this.setState({
      ...this.getMeta(mapValue)
    });
    this.props.onChangeData(
      this.props.id,
      {
        mapKind,
        mapValue
      });
  }

  render() {
    const { days, indexValues, id, mapKind, mapValue } = this.props; 
    const {
      mapKindDefault, mapValueDefault,
      colors, title, label, name
    } = this.state;

    return (
      <div style={{
        minWidth: '200px',
        height: '100%',
        paddingTop: '.3em',
        flex: '1 1 0px',
      }}>
        <MapWrapper
          id={ id }
          mapKind={ mapKind }
          mapValue={ mapValue }
          mapKindDefault={ mapKindDefault }
          mapValueDefault={ mapValueDefault }
          onChangeMapKind={ this.onChangeMapKind }
          onChangeMapValue={ this.onChangeMapValue }
          onRemove={ this.props.onRemove }
          indexValues={ indexValues }
          days={ days }
          colors={ colors }
          title={ title }
          label={ label }
          name={ name }
        />
      </div>
    );
  }
}

// Default values: first element of each's group
const mapKind = MapData.kinds()[0];
const mapValue = MapData.values(mapKind)[0];

MapDataHandler.defaultProps = {
  mapKind,
  mapValue,
  onChangeData: () => {},
  onRemove: () => {},
};

MapDataHandler.propTypes = {
  days: PropTypes.arrayOf(PropTypes.string).isRequired,
  indexValues: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  onChangeData: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  mapKind: PropTypes.string.isRequired,
  mapValue: PropTypes.string.isRequired,
};

export default MapDataHandler;
