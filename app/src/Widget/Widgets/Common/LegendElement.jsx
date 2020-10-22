import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import Box from './Box';

const LegendElement = ({value, color, ...rest}) => {
  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      wrap="nowrap"
      { ...rest }
    >
      <Grid item><Box color={ color } /></Grid>
      <Grid item>{ value }</Grid>
    </Grid>
  );
};

LegendElement.propTypes = {
  value: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export default LegendElement;
