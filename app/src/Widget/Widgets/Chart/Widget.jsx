import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEdit,
  faChartArea as faChart
} from '@fortawesome/free-solid-svg-icons'

import { withHandler, withData } from '../../../Backend/Charts/context'

import Chart from './Chart';
import Edit from './Edit';
import withWidget from '../../Widget';

const ChartWrapper = withWidget({
  // The normal view
  view: {
    icon: <FontAwesomeIcon icon={ faChart } />,
    label: ({ t }) => t("View"),
    title: ({title}) => title,

    // withData: Uses {chartPopulation, chartDivision, chartRegion} props to handle `chartDataset` download
    //   and pass it as a prop, showing <Loading/> until it's downloaded
    render: withData((props) => {
      const {
        // Translated
        days: dies,
        chartData: valors,
        chartPopulation: population,
        chartRegionName: region,
        chartDataset: dataset,
        // Used
        setChartData,
        indexValues,
        id,
      } = props;

      // Once downloaded, set parent's data, so it can properly
      // set title and other widget components
      React.useEffect( () => setChartData(valors), [valors, setChartData]);

      return <Chart
        { ...{
          id, dies, indexValues, valors,
          population, region, dataset
        }}
      />
    })
  },

  // Edit data
  edit: {
    icon: <FontAwesomeIcon icon={ faEdit } />,
    label: ({ t }) => t("Edit"),
    title: ({ t }) => t("Edit chart parameters"),
    render: Edit,
  },
});

/*
   Combine ChartData backend with Chart
*/
class DataHandler extends React.Component {

  state = {
    chartData: false,
  }

  constructor(props) {
    super(props);

    // Default values: first element of each's group
    const {
      chartDivision,
      chartPopulation,
      chartRegion,
      chartDataset,
    } = props;
    const { chartData } = this.state;

    // Used to find metadata from selected options
    // and for the rest of options while editing
    this.state = {
      ...this.state,
      ...this.getMeta(chartDivision, chartPopulation, chartRegion, chartDataset, chartData)
    }
  }

  // Get chartData from child
  // Using this instead of receiving data via props:
  //  - Allows showing <Loading/> only on internal view
  //  - Allows continue editing once a value has changed
  setChartData = (chartData) => {
    if( chartData !== this.state.chartData ) {
      this.setState({ chartData });
    }
  }

  // Get metadata from given params
  getMeta = (chartDivision, chartPopulation, chartRegion, chartDataset, chartData) => {

    // Get selected node metadata and save to cache
    const {children, ...node} = this.props.chartsDataHandler
      .find(chartDivision, chartPopulation, chartRegion);

    if ( !chartData ) {
      return {
        title: '...',
        name: '...',
        node,
      };
    }

    const title = chartData[chartDataset]?.title || chartData[chartDataset]?.name;
    return {
      title,
      name: title,
      node,
    }
  }

  // Set map meta data
  updateData = () => {
    const { chartDivision, chartPopulation, chartRegion, chartDataset } = this.props;
    const { chartData } = this.state;

    this.setState({
      ...this.getMeta(chartDivision, chartPopulation, chartRegion, chartDataset, chartData),
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { chartDivision, chartPopulation, chartRegion, chartDataset } = this.props;
    const { chartData } = this.state;

    // If chartData is unset, gather new data
    if (
      // If params changed, unset chartData
      chartDivision !== prevProps.chartDivision ||
      chartPopulation !== prevProps.chartPopulation ||
      chartRegion !== prevProps.chartRegion ||
      chartDataset !== prevProps.chartDataset ||
      chartData !== prevState.chartData ) {
      this.updateData();
    }
  }

  // Fix region if needed
  // Also, update map metadata
  onChangeChart = (chartDivision, chartPopulation, chartRegion, chartDataset) => {
    this.updateData();
    const {chartsDataHandler, onChangeData, id} = this.props;
    const region = chartsDataHandler
      .findRegion(chartDivision, chartPopulation, chartRegion);
    onChangeData(
      id,
      {
        chartDivision,
        chartPopulation,
        chartDataset,
        chartRegion: region.url
      });
  }

  // Force data update on division change
  onChangeChartDivision = (chartDivision) => {
    const { chartPopulation, chartRegion, chartDataset } = this.props;
    this.onChangeChart(chartDivision, chartPopulation, chartRegion, chartDataset);
  }

  // Force data update on value change
  onChangeChartPopulation = (chartPopulation) => {
    const { chartDivision, chartRegion, chartDataset } = this.props;
    this.onChangeChart(chartDivision, chartPopulation, chartRegion, chartDataset);
  }

  // Force data update on value change
  onChangeChartRegion = (chartRegion) => {
    const { chartDivision, chartPopulation, chartDataset } = this.props;
    this.onChangeChart(chartDivision, chartPopulation, chartRegion, chartDataset);
  }

  // Datasets are on same data object
  onChangeChartDataset = (chartDataset) => {
    const { chartDivision, chartPopulation, chartRegion } = this.props;
    this.onChangeChart(chartDivision, chartPopulation, chartRegion, chartDataset);
  }

  render() {
    const {
      id,
      days,
      indexValues,
      chartDivision,
      chartPopulation,
      chartDataset,
      chartRegion,
      chartsDataHandler: {
        divisions,
        populations,
      },
      onRemove,
    } = this.props; 
    const {
      title, name, node
    } = this.state;

    return (
      <div style={{
        minWidth: '200px',
        height: '100%',
        paddingTop: '.3em',
        flex: '1 1 0px',
      }}>
        <ChartWrapper
          id={ id }
          setChartData={ this.setChartData }
          { ...{
            chartDivision,
            chartPopulation,
            chartDataset,
            chartRegion,
            chartRegionName: node.name,
            indexValues,
            days,
            title,
            name,
          }}
          /* Used in Edit */
          divisions={ divisions }
          populations={ populations }
          onChangeChartDivision={ this.onChangeChartDivision }
          onChangeChartPopulation={ this.onChangeChartPopulation }
          onChangeChartDataset={ this.onChangeChartDataset }
          onChangeChartRegion={ this.onChangeChartRegion }
          onRemove={ onRemove }
        />
      </div>
    );
  }
}

// Default values: first element of each's group
const chartDivision = "REGIÓ/AGA";
const chartPopulation = "Població total";
const chartRegion = 0;
const chartDataset = 'grafic_extensio';

DataHandler.defaultProps = {
  chartDivision,
  chartPopulation,
  chartRegion,
  chartDataset,
  onChangeData: () => {},
  onRemove: () => {},
};

DataHandler.propTypes = {
  days: PropTypes.arrayOf(PropTypes.string).isRequired,
  indexValues: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  onChangeData: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  chartDivision: PropTypes.string.isRequired,
  chartPopulation: PropTypes.string.isRequired,
  chartDataset: PropTypes.string.isRequired,
  chartRegion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
};

export default withHandler(DataHandler);
