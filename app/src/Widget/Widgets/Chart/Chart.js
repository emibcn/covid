import React from 'react';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart,
  Area,
  ReferenceLine,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

import CustomTooltip from './ChartTooltip';

const ChartIEPG = (props) => {
  const { graph, dies, indexValues} = props;
  const data = React.useMemo(
    () => graph.data[0].data
            .map((d,index) => ({v: d, x: dies[index]})),
    [graph,dies],
  );
  return (
    <ResponsiveContainer width='100%' height={350}>
      <LineChart data={data} margin={{ bottom: 20, right: 10, left: 0 }} syncId="charts">
        <Line type="monotone" dataKey="v" dot={null} name={ graph.data[0].label } stroke="#000000" strokeWidth={2} />

        <ReferenceLine y={ 30} stroke="#0f0" strokeDasharray="3 3" />
        <ReferenceLine y={ 70} stroke="#ff0" strokeDasharray="3 3" />
        <ReferenceLine y={100} stroke="#f00" strokeDasharray="3 3" />
        <ReferenceLine x={dies[indexValues]} label={`${data[indexValues].v}`} stroke="#777" strokeDasharray="3 3" />

        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="x" angle={-30} dx={-5} dy={15} />
        <YAxis />
        <Tooltip content={<CustomTooltip/>} />
      </LineChart>
    </ResponsiveContainer>
  )
}

const fillDays = (dies, data) => {
  return data.map((d,index) => {
    if ( index < dies.length ) {
      return dies[dies.length-index-1]
    }
    else {
      const dateParams = dies[0].split('/').reverse().map( d => Number(d));
      dateParams[2] -= (index - dies.length);
      const date = new Date(...dateParams);
      return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
    }
  }).reverse();
}

const ChartExtensio = (props) => {
  const { graph, dies, indexValues} = props;
  const data = React.useMemo(
    () => {
      // Some graphs have extra data previous to the rest
      const diesFull = graph?.data[0]?.data ? fillDays(dies, graph.data[0].data) : dies;
      const data = graph.data[0].data
        .map((d,index) => ({
          v0: d,
          v1: graph.data[1].data[index],
          v2: graph.data[2].data[index],
          x: diesFull[index],
        }));
      return data
    },
    [graph,dies],
  );
  return (
    <ResponsiveContainer width='100%' height={350}>
      <ComposedChart data={data} margin={{ bottom: 20, right: 10, left: 0 }} syncId="charts">
        <ReferenceLine x={dies[indexValues]} label={
            [`${data[indexValues].v0}`,
             `${data[indexValues].v1}`,
             `${data[indexValues].v2}`]
          } stroke="#777" strokeDasharray="3 3" />

        <Area type="monotone" dataKey="v1" dot={null} name={ graph.data[1].label } fill="#cacaca" stroke="#cacaca" strokeWidth={1} />
        <Area type="monotone" dataKey="v0" dot={null} name={ graph.data[0].label } fill="#648ac8" stroke="#648ac8" strokeWidth={1} />
        <Line type="monotone" dataKey="v2" dot={null} name={ graph.data[2].label } stroke="#969696" strokeWidth={1} />

        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="x" angle={-30} dx={-5} dy={15} />
        <YAxis />
        <Tooltip content={<CustomTooltip/>} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

const GraphFromDataset = {
  grafic_risc_iepg: ChartIEPG,
  grafic_extensio: ChartExtensio,
};

const Chart = (props) => {
  const { dataset, valors, ...restProps } = props;
  const ChartDataset = GraphFromDataset[dataset];
  return (
      <ChartDataset graph={ valors[dataset] } {...restProps} />
  )
}

export default Chart;
