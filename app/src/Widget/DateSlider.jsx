import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Slider from './Slider';

// UI Material styles/classes
const useStyles = makeStyles((theme) => ({

  // Add some lateral space for the slider on larger displays
  sliderRoot: {
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.spacing(4),
      marginRight: theme.spacing(4),
    },
    [theme.breakpoints.down('md')]: {
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
    },
  },

  // Play/pause button uses special CSS, so it does the font sizing
  playPause: {
    fontSize: theme.spacing(4/2),
    [theme.breakpoints.up('md')]: {
      fontSize: theme.spacing(6/2),
    },
  },
}));

const DateSlider = ({ days, current, onSetDate }) => {
  const sliderTipFormatter = React.useMemo(() => value => days[value], [days]);
  const {marks, marksSmall} = React.useMemo(
    () => {
      // Marks on the slider
      const marks = days

        // Remember index
        .map( (day, index) => ({day, index}))

        // Get first day of each month
        .filter( ({day, index}) => /^0?1\//.test(day) )

        // Map to Slider marks schema and remove initial `0`
        .map( ({day, index}) => ({
          value: index,
          label: day.replace(/^0/, '')
        }));

      return {
        marks,
        // Small devices: no labels
        marksSmall: marks.map( ({value}) => ({value})),
      }
    },
    [days],
  );

  // Material-UI classes, cached
  const classes = useStyles();
  const sliderClasses = React.useMemo(() => ({
    root: classes.sliderRoot,
    playPause: classes.playPause,
  }), [classes]);

  // Get showMarkLabels prop using MediaQuery
  // Used to prevent showing mark labels on small screens
  const theme = useTheme();
  const showMarkLabels = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Slider
      classes={sliderClasses}
      max={ days.length - 1 }
      value={ current }
      onChange={ onSetDate }
      valueLabelFormat={ sliderTipFormatter }
      getAriaValueText={ sliderTipFormatter }
      // Marks without labels for small screens
      marks={ showMarkLabels ? marks : marksSmall }
      // Always visible on small screens
      valueLabelDisplay={ showMarkLabels ? null : "on" }
    />
  );
}

DateSlider.propTypes = {
  days: PropTypes.array.isRequired,
  current: PropTypes.number.isRequired,
  onSetDate: PropTypes.func.isRequired,
};

export default DateSlider;
