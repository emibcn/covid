import React from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import Pills, { PillsPropTypes } from "./Pills";

function TableSituacioInternalForCache({ elements }) {
  return (
    <Grid container direction="row" alignItems="center">
      {elements.map(({ name, value }) => (
        <Grid
          key={name.replace(/[^a-zA-Z0-9]/gm, "_")}
          item
          container
          direction="column"
          alignItems="center"
        >
          <Grid item>
            <strong>{name}</strong>
          </Grid>
          <Grid item>{value}</Grid>
        </Grid>
      ))}
    </Grid>
  );
}
const TableSituacioInternal = React.memo(TableSituacioInternalForCache);

const TableSituacioInternalPropTypes = {
  elements: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
};
TableSituacioInternalForCache.propTypes = TableSituacioInternalPropTypes;

function TableSituacio({ graph: { elements }, population, region, dies }) {
  return (
    <>
      <Pills population={population} region={region} dies={dies} />
      <TableSituacioInternal elements={elements} />
    </>
  );
}

const TableSituacioPropTypes = {
  graph: PropTypes.shape(TableSituacioInternalPropTypes),
  ...PillsPropTypes,
};
TableSituacio.propTypes = TableSituacioPropTypes;
TableSituacio.defaultProps = {
  graph: { elements: [] },
};

export default TableSituacio;
export { TableSituacioPropTypes };
