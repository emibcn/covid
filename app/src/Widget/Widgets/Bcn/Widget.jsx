import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BcnLogo from './BcnLogo';
import {
  faEdit,
} from '@fortawesome/free-solid-svg-icons'

import BcnData from '../../../Backend/Bcn';

import Chart from '../Common/Chart';

import Edit from './Edit';
import Loading from '../../../Loading';
import withWidget from '../../Widget';

const ChartWrapper = withWidget({
  // The normal view
  view: {
    icon: BcnLogo,
    label: ({ t }) => t("View"),
    title: (props) => props.title,
    render: (props) => {
      const {
        // translated
        days: dies,
        bcnData: data,
        // Discarded
        onChangeDataset,
        onRemove, t,
        // Passed through
        ...restProps
      } = props;
      return (
        <>
          { !props.bcnData ? (
              <Loading />
            ) : (
              <Chart
                { ...{ dies, data } }
                { ...restProps }
              />
            )
          }
        </>
      );
    }
  },
  // Edit data
  edit: {
    icon: <FontAwesomeIcon icon={ faEdit } />,
    label: ({ t }) => t("Edit"),
    title: ({ t }) => t("Edit BCN parameters"),
    render: (props) => <Edit {...props} />,
  },
});

/*
   Combine BcnData backend with Chart
*/
class ChartDataHandler extends React.Component {

  constructor(props) {
    super(props);

    // Default values: first element of each's group
    const { bcnIndex, dataset, section } = props;

    // TODO: Handle errors
    this.BcnData = new BcnData(bcnIndex);
    this.cancelDataUpdate = false;

    this.state = {
      bcnData: null,
      ...this.getMeta(dataset, null)
    }
  }

  defaultMeta = {
    title: '...',
    name: '...',
    theme: null,
    yAxis: null,
    source: null,
  }

  // Get metadata from given params
  getMeta = (dataset, bcnIndex) => {
    if ( !bcnIndex ) {
      return this.defaultMeta;
    }
    const found = this.BcnData.findChild(null, dataset);
    if ( !found ) {
      return this.defaultMeta;
    }
    console.log("ChartDataHandler: getMeta:", {dataset, bcnIndex, found});
    const {title, description, theme, yAxis, source} = found;
    return {
      title,
      name: title,
      description,
      theme,
      yAxis,
      source
    }
  }

  // Fetch map data
  updateData = () => {
    const { dataset } = this.props;

    // If there is an ongoing update, cancel the registration to it
    if (this.cancelDataUpdate) {
      this.cancelDataUpdate();
    }

    // Fetch JSON data and subscribe to updates
    this.cancelDataUpdate = this.BcnData.data(
      dataset,
      (bcnData) => {
        console.log("Widget/Data received:",bcnData);
        // Only update data if we didn't change confs in between
        if ( dataset === this.props.dataset ) {
          this.setState({
            bcnData,
            ...this.getMeta(dataset, bcnData),
          });
        }
      });
  }

  // Ensure first data is gathered as soon as we have the component mounted
  componentDidMount() {
    this.updateData();
  }

  componentDidUpdate(prevProps, prevState) {
    // If bcnData is unset, gather new data
    if( prevState.bcnData !== this.state.bcnData &&
        this.state.bcnData === null ) {
      this.updateData();
    }
    else if (
      // If params changed, unset bcnData
      this.props.dataset !== prevProps.dataset ) {
      this.setState({
        bcnData: null
      });
    }
    else if ( this.props.bcnIndex !== prevProps.bcnIndex ) {
      // If bcnIndex changed, re-create backend with new data
      this.BcnData = new BcnData(this.props.bcnIndex);
      this.setState({
        bcnData: null
      });
    }
  }

  // Also, update metadata
  onChange = (dataset, bcnData) => {
    this.setState({
      ...(bcnData === this.state.bcnData ? {bcnData} : {}),
      ...this.getMeta(dataset, bcnData)
    });
    this.props.onChangeData(
      this.props.id,
      {
        dataset,
      });
  }

  // Datasets are on same data object
  onChangeDataset = (dataset) => {
    const { bcnData } = this.state;
    this.onChange(dataset, bcnData);
  }

  render() {
    const {
      days,
      indexValues,
      id,
      dataset,
      bcnIndex
    } = this.props; 
    const {
      // Data
      bcnData,
      // Meta
      title, name, description,
      theme, yAxis, source
    } = this.state;

    return (
      <div style={{
        minWidth: '200px',
        height: '100%',
        paddingTop: '.3em',
        flex: '1 1 0px',
      }}>
        <ChartWrapper
          { ...{
            id, dataset, bcnIndex, bcnData,
            indexValues, days, title, name,
            description, theme, yAxis, source
          } }
          onChangeDataset={ this.onChangeDataset }
          onRemove={ this.props.onRemove }
        />
      </div>
    );
  }
}

ChartDataHandler.defaultProps = {
  dataset: 'IND_MOB_TRA_PUB',
  onChangeData: () => {},
  onRemove: () => {},
};

ChartDataHandler.propTypes = {
  days: PropTypes.arrayOf(PropTypes.string).isRequired,
  indexValues: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  onChangeData: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  bcnIndex: PropTypes.oneOfType([PropTypes.array.isRequired, PropTypes.instanceOf(null)]),
  dataset: PropTypes.string.isRequired,
};

export default ChartDataHandler;
