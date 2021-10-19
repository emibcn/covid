import React from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";

import LegendElement from "../Common/LegendElement";

/*
   Renders the legend of a map
*/

// Renders an element in the legend list
// - Draws a sqared box with `color` background
// - Adds unit to values, if both unit and value are defined
// - If both `valueStart` and `valueEnd` are defined and greater than 0, as `start - end`
// - If only `valueEnd`, as `< end`
// - If only `valueStart`, as `> start`
const Element = ({ valueStart, valueEnd, color, unit }) => {
  const withUnit = (value) =>
    `${value}${value !== undefined && unit ? unit : ""}`;
  const value =
    valueStart && valueEnd !== null
      ? `${withUnit(valueStart)} - ${withUnit(valueEnd)}`
      : valueEnd !== null
      ? `< ${withUnit(valueEnd)}`
      : `> ${withUnit(valueStart)}`;
  return <LegendElement justify="flex-end" {...{ value, color }} />;
};

Element.propTypes = {
  valueStart: PropTypes.number.isRequired,
  valueEnd: PropTypes.number,
  color: PropTypes.string.isRequired,
  unit: PropTypes.string,
};

// Renders children conditionally wrapped with a tooltip,
// depending on the existence and length of `title` prop
const ConditionalTooltip = ({ title, children, ...rest }) =>
  title && title.length ? (
    <Tooltip arrow placement="top" title={title} {...rest}>
      {children}
    </Tooltip>
  ) : (
    children
  );

ConditionalTooltip.defaultProps = {
  children: [],
};

ConditionalTooltip.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(PropTypes.node),
};

// Renders a legend using prop `colors` (shaped as defined
// with propTypes) as data origin for it
const Legend = ({ colors }) => (
  <Grid
    container
    direction="column"
    justify="center"
    alignItems="flex-start"
    alignContent="center"
  >
    {colors.map((color, index) => (
      <ConditionalTooltip key={index} title={color.name}>
        <Grid item>
          <Element
            valueStart={color.value}
            valueEnd={index === 0 ? null : colors[index - 1].value}
            color={color.color}
          />
        </Grid>
      </ConditionalTooltip>
    ))}
  </Grid>
);

Legend.propTypes = {
  colors: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
      name: PropTypes.string,
      unit: PropTypes.string,
    })
  ),
};

export default Legend;
