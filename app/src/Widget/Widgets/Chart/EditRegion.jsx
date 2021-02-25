import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';

import { withHandler } from '../../../Backend/Charts/context'

// From: https://material-ui.com/components/tree-view/#rich-object

const useStyles = makeStyles({
  root: {
    height: 110,
    flexGrow: 1,
    maxWidth: 400,
  },
});

const RecursiveTreeView = (props) => {
  const classes = useStyles();
  const {
    chartsIndex,
    division,
    population,
    value,
    onChange,
    chartsDataHandler,
    ...restProps
  } = props;

  const onNodeSelect = (event, value) => onChange(Number(value));

  const renderTree = ({url, name, children}) => (
    <TreeItem
      key={url}
      nodeId={`${url}`}
      label={name}
    >
      {
        Array.isArray(children)
          ? children.map( renderTree )
          : null
      }
    </TreeItem>
  );

  const {initialNode, found} = React.useMemo(
    () => {
      const initialNode = chartsDataHandler
        .findInitialNode(division, population);
      const found = chartsDataHandler
        .findBreadcrumb(initialNode, value)
        .map(({url}) => `${url}`);

      return {initialNode, found}
    },
    [division, population, value, chartsDataHandler]
  );

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      expanded={ found }
      selected={ `${value}` }
      onNodeSelect={ onNodeSelect }
      { ...restProps }
    >
      {renderTree(initialNode)}
    </TreeView>
  );
}

export default withHandler(RecursiveTreeView);
