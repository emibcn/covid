import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import TreeView from '@material-ui/lab/TreeView'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import TreeItem from '@material-ui/lab/TreeItem'

import { withHandler } from '../../../Backend/Charts/context'

// From: https://material-ui.com/components/tree-view/#rich-object

const useStyles = makeStyles({
  root: {
    height: 110,
    flexGrow: 1,
    maxWidth: 400
  }
})

function RenderTree ({ url, name, children = null }) {
  return (
    <TreeItem key={url} nodeId={`${url}`} label={name}>
    {
      Array.isArray(children) ?
        children.map(RenderTree)
        : null
    }
    </TreeItem>
  )
}

// Recursive PropTypes
const RenderTreePropTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired
  ]),
}
const RenderTreePropTypesShape = PropTypes.shape(RenderTreePropTypes)
RenderTreePropTypes.children = PropTypes.oneOfType([
    PropTypes.arrayOf(RenderTreePropTypesShape),
    PropTypes.any
  ])

RenderTree.propTypes = RenderTreePropTypes
RenderTree.defaultProps = {
  children: null
}

// Cache the tree: does not depends on
const RenderTreeMemoized = React.memo(RenderTree)

function RecursiveTreeView ({value, found, node, onNodeSelect, ...props}) {
  const classes = useStyles()

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
      <RenderTreeMemoized name={node.name} url={node.url}>
        {node.children}
      </RenderTreeMemoized>
    </TreeView>
  )
}

const RecursiveTreeViewPropTypes = {
  value: PropTypes.string.isRequired,
  found: PropTypes.arrayOf(PropTypes.string).isRequired,
  node: RenderTreePropTypesShape.isRequired
  onNodeSelect: PropTypes.func.isRequired,
}

RecursiveTreeView.propTypes = RecursiveTreeViewPropTypes

function EditRegion (props) {
  const {
    chartsIndex: _, // Remove it from restProps
    division,
    population,
    value,
    onChange,
    chartsDataHandler,
    ...restProps
  } = props

  const onNodeSelect = (event, value) => onChange(Number(value))
  const initialNode = React.useMemo(() => (
    chartsDataHandler.findInitialNode(division, population)
  ), [chartsDataHandler, division, population]);
  const found = React.useMemo(() => (
    chartsDataHandler
      .findBreadcrumb(initialNode, value)
      .map(({ url }) => `${url}`)
  ), [initialNode, value, chartsDataHandler])

  return (
    <RecursiveTreeView
      onNodeSelect={onNodeSelect}
      node={initialNode}
      found={found}
      value={`${value}`}
      {...restProps}
    />
  )
}

const EditRegionPropTypes = {
  division: PropTypes.string.isRequired,
  population: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired
  ]),
  onChange: PropTypes.func.isRequired,
  chartsDataHandler: PropTypes.object.isRequired
}

EditRegion.propTypes = EditRegionPropTypes

export default withHandler(EditRegion)
export {RecursiveTreeViewPropTypes}
