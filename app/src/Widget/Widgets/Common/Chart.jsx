import React from "react";
import PropTypes from "prop-types";

import { useTheme } from "@material-ui/core/styles";

import ChartTooltip, { ChartLegend } from "./ChartTooltip";

// Import charting systems dynamically
import { asyncModuleComponent } from "../../../asyncComponent";

const DefaultColors = [
  "#3366CC",
  "#DC3912",
  "#FF9900",
  "#109618",
  "#990099",
  "#3B3EAC",
  "#0099C6",
  "#DD4477",
  "#66AA00",
  "#B82E2E",
  "#316395",
  "#994499",
  "#22AA99",
  "#AAAA11",
  "#6633CC",
  "#E67300",
  "#8B0707",
  "#329262",
  "#5574A6",
  "#3B3EAC",
];

const MAX_LINES_PER_CHART = 8;

// Parses graph data:
// - Mixes graph dates range with global dates array
// - Fills data graph with each line previous date data
const parseData = (graph, dies) => {
  // Date helpers
  const parseDateStr = (dateStr, sep = "/") =>
    dateStr.split(sep).map((d) => Number(d));
  const parseDate = ([year, month, day]) => new Date(year, month - 1, day);

  // Transforms a date to a string
  // - sep: Separator
  // - reverse: if true, day at begining and year at end
  const dateToString = (date, sep = "/", reverse = false) => {
    const pad2 = (num) => `${num}`.padStart(2, "0");
    const params = [
      pad2(date.getDate()),
      pad2(date.getMonth() + 1),
      date.getFullYear(),
    ];

    return (reverse ? params.reverse() : params).join(sep);
  };

  // Generates an array of Date, containing both ranges,
  // with formats "17/10/2020" and "2020-10-17", respectively
  const fillDays = (range, range2) => {
    // Generates a range (array with starting and ending
    // dates) containing both ranges
    const fixRange = (rangeFix, rangeFix2) => {
      const parsed = rangeFix.map((date) => parseDate(parseDateStr(date, "-"))); // 17/10/2020
      const parsed2 = rangeFix2.map((date) =>
        parseDate(parseDateStr(date).reverse())
      ); // 2020-10-17
      return [
        parsed[0] < parsed2[0] ? parsed[0] : parsed2[0],
        parsed[1] > parsed2[1] ? parsed[1] : parsed2[1],
      ];
    };

    // Returns a Date the day after the Date passed as argument
    const nextDate = (date) => {
      const next = new Date(date.getTime());
      next.setDate(next.getDate() + 1);
      return next;
    };

    // Get combined range
    const [dateStart, dateEnd] = fixRange(range, range2);

    // Generate the Array of dates
    const result = [];
    for (let i = dateStart; i <= dateEnd; i = nextDate(i)) {
      result.push(i);
    }

    return result;
  };

  // Generate a dates array, ranged from first start until the last end
  const days = fillDays(graph[0].range, [dies[0], dies[dies.length - 1]]);
  // Create a hash like: { dateAsStr => { date: dateObject }}
  const daysHash = Object.fromEntries(
    days.map((date, index) => [dateToString(date, "-", true), { date, index }])
  );

  // Allow sorting lines/areas from data
  const graphSorted = [...graph]
    .sort((line1, line2) =>
      line1.order !== undefined ? line1.order - line2.order : 0
    )
    // Maximum number of lines per chart
    .filter((line, index) => index < MAX_LINES_PER_CHART);

  // Fill days hash with graph data
  graphSorted.forEach((line, index) =>
    line.dates.forEach(
      (date, dateIndex) => (daysHash[date][`v${index}`] = line.data[dateIndex])
    )
  );

  const lastOwnDate = parseDate(parseDateStr(graph[0].range[1], "-"));

  return {
    // Fill empty days with data from the previous one (fill the gaps)
    data: days.reduce((result, date, index) => {
      const prev = index > 0 ? result[index - 1] : {};
      result.push({
        ...(lastOwnDate >= date ? prev : {}),
        ...daysHash[dateToString(date, "-", true)],
        x: dateToString(date),
      });
      return result;
    }, []),
    dies: days.map((day) => dateToString(day)),
    daysHash,
    graphSorted,
  };
};

// Translates global selected day to current chart days range index
const translateIndexDays = (diesBase, daysHash, indexValues) => {
  const dayCode = diesBase[indexValues].split("/").reverse().join("-");
  return daysHash[dayCode].index;
};

// Memoized chart: show static data (independent from selected day)
function ChartForCached(props) {
  const {
    data,
    graph,
    colors,
    yAxisLabel,
    scale,
    children,
    syncId,
    components,
  } = props;
  const themeUI = useTheme();
  const {
    ResponsiveContainer,
    ComposedChart,
    Line,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Brush,
  } = components;
  return (
    <ResponsiveContainer width="100%" height={250}>
      <ComposedChart
        data={data}
        margin={{ right: 10, left: 0 }}
        syncId={syncId}
      >
        {/* Extra rechart children can be passed as children to this */}
        {children}

        {graph // Don't save sorting in original array!
          .map((line, index) => {
            const types = { line: Line, area: Area };
            const { type, name, width, color, format } = line;
            const Component =
              type && Object.keys(types).includes(type) ? types[type] : Line;
            return (
              <Component
                key={index}
                type="monotone"
                dataKey={`v${index}`}
                dot={null}
                connectNulls
                name={name}
                strokeWidth={width ?? 2}
                stroke={color ?? colors[index]}
                fill={color ?? colors[index]}
                unit={format?.replace(/^\{[^}]*\}/, "").trim() /* "{,.2f}€" */}
              />
            );
          })}

        <CartesianGrid stroke={themeUI.palette.text.hint} />
        <YAxis
          scale={scale}
          stroke={themeUI.palette.text.hint}
          label={{
            fill: themeUI.palette.text.primary,
            value: yAxisLabel,
            angle: -90,
            offset: 20,
            position: "insideBottomLeft",
          }}
        />
        <XAxis
          dataKey="x"
          interval="preserveStartEnd"
          stroke={themeUI.palette.text.hint}
          angle={-30}
          dx={-5}
          dy={15}
          height={55}
        />
        <Tooltip content={<ChartTooltip />} />
        {graph.zoom ? <Brush dataKey="x" height={30} stroke="#8884d8" /> : null}
      </ComposedChart>
    </ResponsiveContainer>
  );
}

const ChartCachedPropTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  graph: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      color: PropTypes.string,
      format: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  yAxisLabel: PropTypes.string.isRequired,
  scale: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(PropTypes.node),
  syncId: PropTypes.string,
  components: PropTypes.shape({
    ResponsiveContainer: PropTypes.elementType,
    ComposedChart: PropTypes.elementType,
    Line: PropTypes.elementType,
    Area: PropTypes.elementType,
    CartesianGrid: PropTypes.elementType,
    XAxis: PropTypes.elementType,
    YAxis: PropTypes.elementType,
    Tooltip: PropTypes.elementType,
    Brush: PropTypes.elementType,
  }).isRequired,
};
const ChartCached = React.memo(ChartForCached);
ChartForCached.propTypes = ChartCachedPropTypes;
ChartForCached.defaultProps = {
  children: [],
  syncId: null,
};

// Optimized chart:
// - Memoizes the static data
// - Memoizes the real chart with all the static data
// - Renders an extra chart to render time dependent value (reference line for selected date)
function Chart(props) {
  const {
    data: graph,
    dies: diesBase,
    indexValues,
    yAxis,
    children,
    syncId,
  } = props;
  const themeUI = useTheme();
  const { data, dies, daysHash, graphSorted } = React.useMemo(
    () => parseData(graph, diesBase),
    [graph, diesBase]
  );
  const indexTranslated = translateIndexDays(diesBase, daysHash, indexValues);

  const colors = props.theme?.colors || DefaultColors;
  const yAxisLabel = yAxis?.label || "";
  const scale = yAxis?.scale
    ? yAxis.scale === "squarified"
      ? "pow"
      : yAxis.scale
    : "linear";

  const { ResponsiveContainer, ComposedChart, ReferenceLine, XAxis, YAxis } =
    props.components;

  return (
    <div style={{ position: "relative" }}>
      {/* Draw a dedicated graph for the reference line, which changes with the selected day */}
      <div style={{ position: "absolute", width: "100%" }}>
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart data={data} margin={{ right: 10, left: 0 }}>
            <ReferenceLine
              x={dies[indexTranslated]}
              stroke={themeUI.palette.text.hint}
              strokeDasharray="3 3"
            />
            {/* Draw transparent axises to get the size */}
            <YAxis
              stroke="#ffffff00"
              scale={scale}
              label={{
                value: yAxisLabel,
                angle: -90,
                offset: 20,
                position: "insideBottomLeft",
              }}
            />
            <XAxis
              stroke="#ffffff00"
              dataKey="x"
              interval="preserveStartEnd"
              angle={-30}
              dx={-5}
              dy={15}
              height={55}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Memoized component, independent of the selected day */}
      <ChartCached
        data={data}
        graph={graphSorted}
        colors={colors}
        yAxisLabel={yAxisLabel}
        scale={scale}
        syncId={syncId}
        components={props.components}
      >
        {children}
      </ChartCached>

      {/* Use outer legend to lower chart updates */}
      <ChartLegend
        data={data}
        colors={colors}
        indexValues={indexTranslated}
        payload={graphSorted}
      />
    </div>
  );
}

export default asyncModuleComponent(
  () => import("recharts"),
  [
    "ResponsiveContainer",
    "ComposedChart",
    "Line",
    "Area",
    "ReferenceLine",
    "CartesianGrid",
    "XAxis",
    "YAxis",
    "Tooltip",
    "Brush",
  ],
  Chart
);
