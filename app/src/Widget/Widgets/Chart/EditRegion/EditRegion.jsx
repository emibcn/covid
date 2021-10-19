import React from "react";
import PropTypes from "prop-types";

import { withHandler } from "../../../../Backend/Charts/context";

import RecursiveTreeView from "./RecursiveTreeView";

function EditRegion(props) {
  const {
    // Remove it from restProps: it comes from
    // Charts handler, not parent component
    // eslint-disable-next-line no-unused-vars
    chartsIndex: _,
    division,
    population,
    value,
    onChange,
    chartsDataHandler,
    ...restProps
  } = props;

  const onNodeSelect = (event, v) => onChange(Number(v));
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
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  onChange: PropTypes.func.isRequired,
  chartsDataHandler: PropTypes.shape({
    findInitialNode: PropTypes.func.isRequired,
    findBreadcrumb: PropTypes.func.isRequired,
  }).isRequired,
  chartsIndex: PropTypes.string,
};

EditRegion.propTypes = EditRegionPropTypes;
EditRegion.defaultProps = {
  chartsIndex: "",
}

export default withHandler(EditRegion);
