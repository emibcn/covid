import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';

import { withHandler } from '../../../Backend/Bcn/context';

// From: https://material-ui.com/components/tree-view/#rich-object

const styles = {
  root: {
    flexGrow: 1,
    maxWidth: 400,
  },
};

const Tree = ({node}) => (
  <TreeItem
    key={node.code}
    nodeId={`${!('values' in node) ? 'DISABLED-' : ''}${node.code}`}
    label={node.title}
  >
    {
      Array.isArray(node.sections)
        ? node.sections.map( (node, key) => <Tree {...{node, key}} />)
        : null
    }
  </TreeItem>
)

class RecursiveTreeView extends React.Component {

  state = {
    breadcrumb: [],
    value: '',
  }

  onNodeSelect = (event, value, ...rest) => {
    // Don't save values for disabled nodes
    if (!/^DISABLED-/.test(value)) {
      this.props.onChange(value);
    }
  }

  constructor(props) {
    super(props);

    const { value, bcnDataHandler } = props;

    this.state = {
      value,
      breadcrumb: bcnDataHandler
        .findBreadcrumb(null, value)
        .map(node => `${!('values' in node) ? 'DISABLED-' : ''}${node.code}`),
    };
  }

  render = () => {
    const { classes, bcnDataHandler, ...restProps } = this.props;
    const { breadcrumb, value } = this.state;

    return (
      <TreeView
        className={classes.root}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        defaultExpanded={ breadcrumb }
        defaultSelected={ value }
        onNodeSelect={ this.onNodeSelect }
        { ...restProps }
      >
        { bcnDataHandler
            .filter( section => ['graph','chart'].includes(section.type) )
            .map( section => <Tree key={section.code} node={section} />) }
      </TreeView>
    );
  }
}

export default withHandler(
  withStyles(styles)(
    RecursiveTreeView
  ));
