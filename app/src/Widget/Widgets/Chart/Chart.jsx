import React from 'react';

import Grid from '@material-ui/core/Grid';

import ChartBcn from '../Common/Chart';

// Import charting systems dynamically
import asyncComponent from '../../../asyncComponent';
const ReferenceLine = asyncComponent(() => import('recharts'), 'ReferenceLine');

const dataTransform = (dies, graph, chartsStyles=[]) => {
  const reformatDate = (date) => date
    .split('/')
    .reverse()
    .join('-');
  const range = [
    dies[0],
    dies[dies.length - 1]
  ].map( reformatDate );
  const dates = dies.map( reformatDate );

  return graph.data
    .map( ({data, label}, index) => ({
      data,
      name: label,
      range,
      dates,
      ...(chartsStyles[index] ?? {}),
    }))
}

const chartsStylesIEPG = [
  {type: 'line', color: "#000000", width: 3},
];

const ChartIEPG = (props) => {
  const { graph, dies, indexValues} = props;
  const {data, references} = React.useMemo(
    () => ({
      data: dataTransform(dies, graph, chartsStylesIEPG),
      references: [
        {y: 30, color: "#0f0"},
        {y: 70, color: "#ff0"},
        {y: 100, color: "#f00"}
      ].map( ({y, color}, key) =>
        <ReferenceLine
          key={key}
          y={y}
          stroke={color}
          strokeDasharray="3 3"
          ifOverflow="extendDomain" />
      )
    }),
    [graph,dies],
  );

  return (
    <ChartBcn
      syncId="charts"
      { ...{dies, indexValues, data}}
    >
      { references }
    </ChartBcn>
  )
}

const chartsStylesExtensio = [
  {type: 'area', order: 1, color: "#648ac8", width: 1},
  {type: 'area', order: 0, color: "#cacaca", width: 1},
  {type: 'line', order: 2, color: "#969696", width: 1},
];

const ChartExtensio = (props) => {
  const { graph, dies, indexValues} = props;
  const data = React.useMemo(
    () => dataTransform(dies, graph, chartsStylesExtensio),
    [graph,dies],
  );

  return (
    <ChartBcn
      syncId="charts"
      { ...{dies, indexValues, data}}
    />
  )
}

const TableSeguiment = ({graph}) => {
  return (
    <table>
      <thead>
        <tr>
          { graph.headers
              .map( ({content, title}, index) =>
                <th key={index} title={title}>{content}</th>
              )
          }
        </tr>
      </thead>
      <tbody>
          { graph.body
              .map( (row, index) =>
                <tr key={index}>
                  { row.map( ({content}, cellIndex) =>
                      <td key={cellIndex}>{content}</td>
                    )
                  }
                </tr>
              )
          }
      </tbody>
    </table>
  )
}

const TableSituacio = ({graph}) => {
  return (
    <Grid
      container
      direction="row"
      alignItems="center"
    >
    { graph.elements
        .map( ({name, value}, index) => (
          <Grid
            key={index}
            item
            container
            direction="column"
            alignItems="center"
          >
            <Grid item><strong>{name}</strong></Grid>
            <Grid item>{value}</Grid>
          </Grid>
        ))
    }
    </Grid>
  )
}

const GraphFromDataset = {
  grafic_risc_iepg: ChartIEPG,
  grafic_extensio: ChartExtensio,
  situacio: TableSituacio,
  seguiment: TableSeguiment,
};

const Chart = (props) => {
  const { dataset, valors, ...restProps } = props;
  const ChartDataset = GraphFromDataset[dataset];
  return <ChartDataset graph={ valors[dataset] } {...restProps} />
}

export default Chart;
