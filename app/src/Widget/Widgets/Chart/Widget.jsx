import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEdit,
  faChartArea as faChart
} from '@fortawesome/free-solid-svg-icons'

import { withChartsDataHandler } from '../../../Backend/Charts/ChartsContext'

import Chart from './Chart';
import Edit from './Edit';
import Loading from '../../../Loading';
import withWidget from '../../Widget';

const ChartWrapper = withWidget({
  // The normal view
  view: {
    icon: <FontAwesomeIcon icon={ faChart } />,
    label: ({ t }) => t("View"),
    title: (props) => props.title,
    render: (props) => (
      <>
        { !props.chartData ? (
            <Loading />
          ) : (
            <Chart
              dies={ props.days }
              valors={ props.chartData }
              dataset={ props.chartDataset }
              indexValues={ props.indexValues }
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
    title: ({ t }) => t("Edit chart parameters"),
    render: (props) => <Edit {...props} />,
  },
});

/*
   Combine ChartData backend with Chart
*/
class ChartDataHandler extends React.Component {

  constructor(props) {
    super(props);

    // Default values: first element of each's group
    const {
      chartDivision,
      chartPopulation,
      chartRegion,
      chartsIndex,
      chartsDataHandler,
    } = props;

    // TODO: Handle errors
    this.ChartData = new chartsDataHandler(chartsIndex);
    this.cancelDataUpdate = false;

    this.state = {
      chartData: null,
      ...this.getMeta(chartDivision, chartPopulation, chartRegion, chartDataset, null)
    }
  }

  // Get metadata from given params
  getMeta = (chartDivision, chartPopulation, chartRegion, chartDataset, chartData) => {
    if ( !chartData ) {
      return {
        title: '...',
        name: '...',
      };
    }
    return {
      title: chartData[chartDataset].title,
      name: chartData[chartDataset].title,
    }
  }

  // Fetch map data
  updateData = () => {
    const { chartDivision, chartPopulation, chartRegion } = this.props;

    // If there is an ongoing update, cancel the registration to it
    if (this.cancelDataUpdate) {
      this.cancelDataUpdate();
    }

    // Fetch JSON data and subscribe to updates
    this.cancelDataUpdate = this.ChartData.data(
      chartDivision,
      chartPopulation,
      chartRegion,
      (chartData) => {
        // Only update data if we didn't change chart confs in between
        if ( chartDivision === this.props.chartDivision &&
             chartPopulation === this.props.chartPopulation   &&
             chartRegion === this.props.chartRegion ) {
          this.setState({
            chartData,
            ...this.getMeta(chartDivision, chartPopulation, chartRegion, this.props.chartDataset, chartData),
          });
        }
      });
  }

  // Ensure first data is gathered as soon as we have the component mounted
  componentDidMount() {
    this.updateData();
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      state: { chartData },
      props: { chartDivision, chartPopulation, chartRegion, chartsIndex, chartsDataHandler }
    } = this;

    // If chartData is unset, gather new data
    if( prevState.chartData !== chartData && chartData === null ) {
      this.updateData();
    }
    else if (
      // If params changed, unset chartData
      chartDivision !== prevProps.chartDivision ||
      chartPopulation !== prevProps.chartPopulation ||
      chartRegion !== prevProps.chartRegion ) {
      this.setState({
        chartData: null
      });
    }
    else if ( chartsIndex !== prevProps.chartsIndex ) {
      // If chartsIndex changed, re-create backend with new data
      this.ChartData = new chartsDataHandler(chartsIndex);
      this.setState({
        chartData: null
      });
    }
  }

  // Used to fix region when changing main options.
  // TODO: Find a better way. ID by breadcrumb?
  findRegion = (division, population, region) => {
    const {chartsIndex} = this.props;
    const initialNode = this.ChartData.findInitialNode(division, population);
    const found = this.ChartData.findChild(initialNode, region);

    if ( !found ) {
      // Try to find in the other valid initialNodes (same division)
      const nodes = chartsIndex.filter( (node) =>
        division === node.territori &&
        population !== node.poblacio
      );
      for (const node of nodes ) {
        // Look for region in the other initialNode
        const f1 = this.ChartData.findChild(node, region);
        // If found, find in our initialNode for a region with the same name
        const f2 = f1 && this.ChartData.findChild(
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

  // Fix region if needed
  // Also, update map metadata
  onChangeChart = (chartDivision, chartPopulation, chartRegion, chartDataset, chartData) => {
    this.setState({
      ...(chartData === this.state.chartData ? {chartData} : {}),
      ...this.getMeta(chartDivision, chartPopulation, chartRegion, chartDataset, chartData)
    });
    const region = this.findRegion(chartDivision, chartPopulation, chartRegion);
    this.props.onChangeData(
      this.props.id,
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
    this.onChangeChart(chartDivision, chartPopulation, chartRegion, chartDataset, null);
  }

  // Force data update on value change
  onChangeChartPopulation = (chartPopulation) => {
    const { chartDivision, chartRegion, chartDataset } = this.props;
    this.onChangeChart(chartDivision, chartPopulation, chartRegion, chartDataset, null);
  }

  // Force data update on value change
  onChangeChartRegion = (chartRegion) => {
    const { chartDivision, chartPopulation, chartDataset } = this.props;
    this.onChangeChart(chartDivision, chartPopulation, chartRegion, chartDataset, null);
  }

  // Datasets are on same data object
  onChangeChartDataset = (chartDataset) => {
    const { chartDivision, chartPopulation, chartRegion } = this.props;
    const { chartData } = this.state;
    this.onChangeChart(chartDivision, chartPopulation, chartRegion, chartDataset, chartData);
  }

  render() {
    const {
      days,
      indexValues,
      id,
      chartDivision,
      chartPopulation,
      chartDataset,
      chartRegion,
      chartsIndex
    } = this.props; 
    const {
      chartData, title, name
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
          chartDivision={ chartDivision }
          chartPopulation={ chartPopulation }
          chartDataset={ chartDataset }
          chartRegion={ chartRegion }
          chartsIndex={ chartsIndex }
          chartData={ chartData }
          divisions={ this.ChartData.divisions }
          populations={ this.ChartData.populations }
          onChangeChartDivision={ this.onChangeChartDivision }
          onChangeChartPopulation={ this.onChangeChartPopulation }
          onChangeChartDataset={ this.onChangeChartDataset }
          onChangeChartRegion={ this.onChangeChartRegion }
          onRemove={ this.props.onRemove }
          indexValues={ indexValues }
          days={ days }
          title={ title }
          name={ name }
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

ChartDataHandler.defaultProps = {
  chartDivision,
  chartPopulation,
  chartRegion,
  chartDataset,
  onChangeData: () => {},
  onRemove: () => {},
};

ChartDataHandler.propTypes = {
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

export default withChartsDataHandler(ChartDataHandler);
