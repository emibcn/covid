import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEdit,
  faChartArea as faChart
} from '@fortawesome/free-solid-svg-icons'

import { withHandler, withIndex, withData } from '../../../Backend/Charts/context'

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
    render: withData(({
      setChartData, chartData, days, indexValues, id,
      chartPopulation, chartRegionName, chartDataset,
    }) => {

      //   Once downloaded, set parent's data, so it can properly set title and other widget components
      React.useEffect( () => setChartData(chartData), [chartData, setChartData]);

      return <Chart
        id={ id }
        dies={ days }
        indexValues={ indexValues }
        valors={ chartData }
        population={ chartPopulation }
        region={ chartRegionName }
        dataset={ chartDataset }
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
      chartsIndex,
      chartsDataHandler,
    } = props;
    const { chartData } = this.state;

    // TODO: Handle errors
    // Used to find metadata from selected options
    // and for the rest of options while editing
    this.ChartData = new chartsDataHandler(chartsIndex);

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
    const {children, ...node} = this.ChartData.find(chartDivision, chartPopulation, chartRegion);
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
    const { chartDivision, chartPopulation, chartRegion, chartDataset, chartsIndex } = this.props;
    const { chartData } = this.state;

    // If index changed, update backend with new data
    if ( chartsIndex !== prevProps.chartsIndex ) {
      this.ChartData.parseIndex(chartsIndex);
    }

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
  onChangeChart = (chartDivision, chartPopulation, chartRegion, chartDataset) => {
    this.updateData();
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
      chartsIndex,
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
            chartsIndex,
            indexValues,
            days,
            title,
            name,
          }}
          divisions={ this.ChartData.divisions }
          populations={ this.ChartData.populations }
          onChangeChartDivision={ this.onChangeChartDivision }
          onChangeChartPopulation={ this.onChangeChartPopulation }
          onChangeChartDataset={ this.onChangeChartDataset }
          onChangeChartRegion={ this.onChangeChartRegion }
          onRemove={ this.props.onRemove }
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

export default withHandler(
  withIndex( DataHandler, 'chartsIndex'));
