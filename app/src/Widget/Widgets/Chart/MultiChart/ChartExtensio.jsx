import React from "react";

import Chart from "../../Common/Chart";
import dataTransform from "./dataTransform";
import { ChartIEPGPropTypes } from "./ChartIEPG";

const chartsStylesExtensio = [
  { type: "area", order: 1, color: "#648ac8", width: 1 },
  { type: "area", order: 0, color: "#cacaca", width: 1 },
  { type: "line", order: 2, color: "#969696", width: 1 },
];

function ChartExtensio({ graph, dies, indexValues }) {
  const data = React.useMemo(
    () => dataTransform(dies, graph, chartsStylesExtensio),
    [graph, dies]
  );

  return (
    <Chart syncId="charts" dies={dies} indexValues={indexValues} data={data} />
  );
}

const ChartExtensioPropTypes = ChartIEPGPropTypes;
ChartExtensio.propTypes = ChartExtensioPropTypes;
ChartExtensio.defaultProps = {
  graph: { data: [] },
  dies: [],
  indexValues: 0,
};

export default ChartExtensio;
export { ChartExtensioPropTypes };
