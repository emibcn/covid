import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';

import ChartData from '../../../Backend/Charts';

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
  const { chartsIndex, division, population, value, onChange } = props;

  const onNodeSelect = (event, value) => onChange(Number(value));

  const renderTree = (nodes) => (
    <TreeItem key={nodes.url} nodeId={`${nodes.url}`} label={nodes.name}>
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </TreeItem>
  );

  const {initialNode, found} = React.useMemo(
    () => {
      const chartData = new ChartData(chartsIndex);
      const initialNode = chartData.findInitialNode(division, population);
      const found = chartData.findBreadcrumb(initialNode, value).map(link => `${link.url}`);

      return {initialNode, found}
    },
    [division,population,value,chartsIndex]
  );

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      expanded={ found }
      selected={ `${value}` }
      onNodeSelect={ onNodeSelect }
    >
      {renderTree(initialNode)}
    </TreeView>
  );
}

export default RecursiveTreeView;
