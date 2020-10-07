import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faInfoCircle as faLegend,
  faEdit,
  faGlobeEurope as faMap
} from '@fortawesome/free-solid-svg-icons'

import MapData from '../../../Backend/Maps';

import MapImage from './MapImage';
import Edit from './Edit';
import Legend from './Legend';
import Loading from '../../../Loading';
import withWidget from '../../Widget';

const MapWrapper = withWidget({
  // The normal view
  view: {
    icon: <FontAwesomeIcon icon={ faMap } />,
    label: ({ t }) => t("View"),
    title: (props) => props.name,
    render: (props) => (
      <>
        { props.mapData === null ? (
            <Loading />
          ) : (
            <MapImage
              label={ props.label }
              dies={ props.days }
              valors={ props.mapData.valors }
              mapSrc={ MapData.svg(props.mapKind) }
              indexValues={ props.indexValues }
              colors={ props.colors }
              id={ props.id }
            />
          )
        }
      </>
    )
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

    // TODO: Handle errors
    this.MapData = new MapData();
    this.cancelDataUpdate = false;

    // Default values: first element of each's group
    // TODO: Get data from storage/router/props
    const { mapKind, mapValue } = props;

    this.state = {
      mapData: null,
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

  // Fetch map data
  updateData = () => {
    const { mapKind, mapValue } = this.props;

    // If there is an ongoing update, cancel the registration to it
    if (this.cancelDataUpdate) {
      this.cancelDataUpdate();
    }

    this.cancelDataUpdate = this.MapData.data(mapKind, mapValue, mapData => {
      // Only update data if we didn't change map confs in between
      if (mapKind === this.props.mapKind && mapValue === this.props.mapValue) {
        this.setState({ mapData });
      }
    });
  }

  // Ensure first data is gathered as soon as we have the component mounted
  componentDidMount() {
    this.updateData();
  }

  componentDidUpdate(prevProps, prevState) {
    // If mapData is unset, gather new data
    if( prevState.mapData !== this.state.mapData &&
        this.state.mapData === null ) {
      this.updateData();
    }
    else if (
      // If params changed, unset mapData
      this.props.mapKind !== prevProps.mapKind ||
      this.props.mapValue !== prevProps.mapValue ) {
      this.setState({
        mapData: null
      });
    }
  }

  // Force data update on kind change
  onChangeMapKind = (mapKind) => {
    const { mapValue } = this.props;
    this.setState({
      mapData: null
    });
    this.props.onChangeData(
      this.props.id,
      {
        mapKind,
        mapValue
      });
  }

  // Force data update on value change
  // Also, update map metadata
  onChangeMapValue = (mapValue) => {
    const { mapKind } = this.props;
    this.setState({
      mapData: null,
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
      mapData, mapKindDefault, mapValueDefault,
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
          mapData={ mapData }
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
