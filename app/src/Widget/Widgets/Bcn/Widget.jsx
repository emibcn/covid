import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BcnLogo from './BcnLogo';
import {
  faEdit,
} from '@fortawesome/free-solid-svg-icons'

import { withHandler, withIndex, withData } from '../../../Backend/Bcn/context';

import Chart from '../Common/Chart';
import Edit from './Edit';
import withWidget from '../../Widget';

const ChartWrapper = withWidget({
  // The normal view
  view: {
    icon: BcnLogo,
    label: ({ t }) => t("View"),
    title: (props) => props.title,
    render: withData((props) => {
      const {
        // Translated
        days: dies,
        bcnData: data,
        // Discarded
        setBcnData,
        onRemove, t,
        dataset, onChangeDataset,
        bcnIndex, bcnDataHandler,
        // Passed through
        ...restProps
      } = props;
      React.useEffect( () => setBcnData(data), [data, setBcnData]);
      return <Chart
        { ...{ dies, data } }
        { ...restProps }
      />
    }),
  },

  // Edit data
  edit: {
    icon: <FontAwesomeIcon icon={ faEdit } />,
    label: ({ t }) => t("Edit"),
    title: ({ t }) => t("Edit BCN parameters"),
    render: Edit,
  },
});

/*
   Combine BcnData backend with Chart
*/
class DataHandler extends React.Component {

  state = {
    bcnData: null,
  }

  constructor(props) {
    super(props);

    // Default values: first element of each's group
    const { bcnDataHandler, bcnIndex } = props;

    // TODO: Handle errors
    this.BcnData = new bcnDataHandler(bcnIndex);

    this.state = {
      ...this.state,
      ...this.getMeta(this.props.dataset, this.state.bcnData),
    };
  }

  defaultMeta = {
    title: '...',
    name: '...',
    theme: null,
    yAxis: null,
    source: null,
  }

  setBcnData = (bcnData) => this.setState({ bcnData });

  // Get metadata from given params
  getMeta = (dataset, bcnData) => {
    if ( !bcnData ) {
      return this.defaultMeta;
    }
    const found = this.BcnData.findChild(null, dataset);
    if ( !found ) {
      return this.defaultMeta;
    }
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

  // Update metadata
  updateData = () => {
    const {
      state: { bcnData },
      props: { dataset }
    } = this;
    this.setState({
      ...this.getMeta(dataset, bcnData),
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      bcnIndex, dataset
    } = this.props;
    const { bcnData } = this.state;

    // If index changed, update backend with new data
    if ( bcnIndex !== prevProps.bcnIndex ) {
      this.BcnData.parseIndex(bcnIndex);
    }

    if( dataset !== prevProps.dataset ||
        bcnData !== prevState.bcnData ) {
      this.updateData();
    }
  }

  // Update params in parents
  onChange = (dataset) => {
    this.props.onChangeData(
      this.props.id,
      {
        dataset,
      });
  }

  // Datasets are on same data object
  onChangeDataset = (dataset) => {
    this.onChange(dataset);
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
            // Used in Edit
            id, dataset, bcnIndex,
            // Used in View
            indexValues, days, title, name,
            description, theme, yAxis, source
          } }
          // Used in Edit
          onChangeDataset={ this.onChangeDataset }
          onRemove={ this.props.onRemove }
          // Used in View
          setBcnData={ this.setBcnData }
        />
      </div>
    );
  }
}

DataHandler.defaultProps = {
  dataset: 'IND_DEF_OBS_CAT',
  onChangeData: () => {},
  onRemove: () => {},
};

DataHandler.propTypes = {
  days: PropTypes.arrayOf(PropTypes.string).isRequired,
  indexValues: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  onChangeData: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  bcnIndex: PropTypes.oneOfType([PropTypes.array.isRequired, PropTypes.instanceOf(null)]),
  dataset: PropTypes.string.isRequired,
};

export default withHandler(
  withIndex( DataHandler, 'bcnIndex'));
