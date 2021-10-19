import React from "react";
import PropTypes from "prop-types";

import TreeView from "@material-ui/lab/TreeView";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import RenderTree, { RenderTreePropTypesShape } from "./RenderTree";

const useStyles = makeStyles({
  root: {
    height: 110,
    flexGrow: 1,
    maxWidth: 400,
  },
});

function RecursiveTreeView({ value, found, node, onNodeSelect, ...props }) {
  const classes = useStyles();

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      expanded={found}
      selected={value}
      onNodeSelect={onNodeSelect}
      {...props}
    >
      <RenderTree name={node.name} url={node.url}>
        {node.children}
      </RenderTree>
    </TreeView>
  );
}

const RecursiveTreeViewPropTypes = {
  value: PropTypes.string.isRequired,
  found: PropTypes.arrayOf(PropTypes.string).isRequired,
  node: RenderTreePropTypesShape.isRequired,
  onNodeSelect: PropTypes.func.isRequired,
};

RecursiveTreeView.propTypes = RecursiveTreeViewPropTypes;

export default RecursiveTreeView;
export { RecursiveTreeViewPropTypes };
