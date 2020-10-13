import React from 'react';

import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles( theme => ({
  tooltip: {
    backgroundColor: theme.palette.background.default,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.text.hint,
    ...theme.shape,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    padding: theme.spacing(1),
  },
  label: {
    ...theme.typography.subtitle1,
  },
  list: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
  },
  element: {
    lineHeight: `${theme.spacing(2.2)}px`,
    display: 'flex',
    margin: `${theme.spacing(.5)}px 0`,
    justifyContent: 'flex-start',
  },
  box: {
    display: "inline-block",
    width: theme.spacing(2),
    height: theme.spacing(2),
    padding: 0,
    marginRight: theme.spacing(1),
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.text.hint,
  },
  data: {
    margin: 0,
    padding: 0,
  },
}));

const Box = (props) => {
  const classes = useStyles();
  return <div className={ classes.box } style={{ backgroundColor: props.color }} />;
}

const TooltipElement = (props) => {
  const classes = useStyles();
  return <li className={ classes.element }><Box color={ props.color } />{ props.name }: { props.value }</li>;
}

const CustomTooltip = ({active, payload, label}) => {
  const classes = useStyles();
  if (active) {
    return (
      <div className={ classes.tooltip }>
        <p className={ classes.label }>{ label }</p>
        <ul className={ classes.list }>
          { payload.map( (pl, index) => <TooltipElement key={ index } { ...pl }/> )}
        </ul>
      </div>
    );
  }

  return null;
}

export default CustomTooltip;
