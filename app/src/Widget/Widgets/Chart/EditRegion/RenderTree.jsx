import React from 'react'
import PropTypes from 'prop-types'

import TreeItem from '@material-ui/lab/TreeItem'


// From: https://material-ui.com/components/tree-view/#rich-object

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

// Cache the tree
const RenderTreeMemoized = React.memo(RenderTree)

export default RenderTreeMemoized
export {RenderTreePropTypes, RenderTreePropTypesShape}
