import React from 'react';
import PropTypes from 'prop-types';

import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

// UI Material styles/classes
const useStyles = makeStyles( (theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixed: {
    position: 'sticky',
    top: 0,
    zIndex: 1200,
    padding: 0,
    // Not using it, adds a scrolling slider to the container on some screens
    paddingBottom: 1,
  },
  sliderContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(.5),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    // Marks labels not shown under 'md'
    [theme.breakpoints.up('md')]: {
      marginBottom: theme.spacing(1),
      alignItems: 'flex-start',
    },
    // This is for non-mouse pointers, which need some extra space for usability
    // Not using it, adds a scrolling slider to the container on some screens
    // eslint-disable-next-line no-useless-computed-key
    ['@media (pointer: coarse)']: {
      [theme.breakpoints.up('md')]: {
        marginTop: theme.spacing(.5),
        paddingBottom: theme.spacing(1),
      },
      [theme.breakpoints.down('sm')]: {
        paddingBottom: theme.spacing(.1),
      },
    }
  },
}));

const ListHeader = ({children}) => {
  const classes = useStyles();
  const fixedPaper = clsx(classes.paper, classes.fixed);

  return (
    <Paper className={ fixedPaper } elevation={ 2 }>
      {/* Space used by the App Bar fixed positioned */}
      <div className={ classes.appBarSpacer } />
      {/*
      <Container maxWidth="lg" className={classes.container}>
        <h3>HELLO WORLD!</h3>
      </Container>
      */}

      <div className={ classes.sliderContainer } >
        { children }
      </div>
    </Paper>
  );
}

ListHeader.propTypes = {
  children: PropTypes.arrayOf( PropTypes.element ),
};

export default ListHeader;
