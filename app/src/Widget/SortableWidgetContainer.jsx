import React from 'react'
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { Grid, makeStyles } from '@material-ui/core';

import WidgetsTypes from './Widgets';

const useStyles = makeStyles({
  // Fixing some spotty behavior with the cursor style changing when dragging an item
  // See this issue for more info: https://github.com/clauderic/react-sortable-hoc/issues/212
  pointerEventsFix: {
    pointerEvents: 'auto !important'
  },
  widgetsContainer: {
    zIndex: 10,
    width: '100%',
    margin: 0,
  },
})

const DraggableWidgetContainer = SortableElement((props) => {
  const {
    bcnIndex,
    chartsIndex,
    days,
    indexValues,
    onChangeData,
    onRemove,
    value,
    widgetId,
  } = props;
  
  const { Component } = WidgetsTypes.find(w => w.key === value.type );
  
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Component
        id={widgetId}
        bcnIndex={bcnIndex}
        chartsIndex={chartsIndex}
        days={days}
        indexValues={indexValues}
        onChangeData={onChangeData}
        onRemove={onRemove}
        {...value.payload}
      />
    </Grid>
  )
})

const DraggableWidgetsList = SortableContainer((props) => {
  const {
    items: widgets,
    widgetsIds,
  } = props;
  const classes = useStyles();

  return (
    <Grid container spacing={3} className={classes.widgetsContainer}>
      {widgets.map((value, index) => {
        // Create a separate id for the individual widgets
        // The SortableElements will use the map method's index for sorting
        const widgetId = widgetsIds[index];
        return (
          <DraggableWidgetContainer 
            key={widgetId}
            index={index}
            widgetId={widgetId}
            value={value}
            {...props}
          />
        )
      })}
    </Grid>
  )
})

const SortableWidgetContainer = (props) => {
  const { widgets, onReorder } = props;
  const classes = useStyles();

  // Handle reordering of widgets after dragging and dropping
  const onSortEnd = ({ oldIndex, newIndex }) => {
    onReorder(oldIndex, newIndex);
  };

  return (
    <DraggableWidgetsList 
      axis="xy"
      items={widgets}
      helperClass={classes.pointerEventsFix}
      onSortEnd={onSortEnd}
      useDragHandle
      {...props}
    />
  )
}

export default SortableWidgetContainer
