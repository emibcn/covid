import React from "react";
import PropTypes from "prop-types";

import { withHandler } from "../../../../Backend/Charts/context";

import RecursiveTreeView from "./RecursiveTreeView";

function EditRegion(props) {
  const {
    chartsIndex: _, // Remove it from restProps
    division,
    population,
    value,
    onChange,
    chartsDataHandler,
    ...restProps
  } = props;

  const onNodeSelect = (event, value) => onChange(Number(value));
  const initialNode = React.useMemo(
    () => chartsDataHandler.findInitialNode(division, population),
    [chartsDataHandler, division, population]
  );
  const found = React.useMemo(
    () =>
      chartsDataHandler
        .findBreadcrumb(initialNode, value)
        .map(({ url }) => `${url}`),
    [initialNode, value, chartsDataHandler]
  );

  return (
    <RecursiveTreeView
      onNodeSelect={onNodeSelect}
      node={initialNode}
      found={found}
      value={`${value}`}
      {...restProps}
    />
  );
}

const EditRegionPropTypes = {
  division: PropTypes.string.isRequired,
  population: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired,
  ]),
  onChange: PropTypes.func.isRequired,
  chartsDataHandler: PropTypes.object.isRequired,
};

EditRegion.propTypes = EditRegionPropTypes;

export default withHandler(EditRegion);
