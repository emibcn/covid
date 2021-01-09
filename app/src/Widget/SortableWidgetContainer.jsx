import React from 'react'
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { Grid, makeStyles } from '@material-ui/core';

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

const DraggableWidgetContainer = SortableElement(({ Component, payload, ...props}) => {
  // Merge props from general props and from payload
  // Add first the payload values, so them cannot overwrite the ones from props
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Component {...payload} {...props} />
    </Grid>
  )
})

const DraggableWidgetsList = SortableContainer(({ items: widgets, ...props }) => {
  const classes = useStyles();

  return (
    <Grid container spacing={3} className={classes.widgetsContainer}>
      {widgets.map(({ id, Component, payload }, index) => {
        // Use `id` for the key to optimize renders on reorder
        // The SortableElements will use the map method's index for sorting
        // Passthrough `id`, `Component` and `payload`
        return (
          <DraggableWidgetContainer 
            key={id}
            index={index}
            {...props}
            {...{id, Component, payload}}
          />
        )
      })}
    </Grid>
  )
})

const SortableWidgetContainer = ({ widgets, onReorder, ...props }) => {
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
