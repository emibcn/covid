import React from 'react'
import PropTypes from 'prop-types'

import Chart from '../../Common/Chart'
import dataTransform from './dataTransform'

// Import charting systems dynamically
import asyncComponent from '../../../../asyncComponent'
const ReferenceLine = asyncComponent(() => import('recharts'), 'ReferenceLine')

// Adapt data shape to the expected by `Common/Chart`
const chartsStylesIEPG = [{ type: 'line', color: '#000000', width: 3 }]

function ChartIEPG ({ graph, dies, indexValues }) {
  const { data, references } = React.useMemo(
    () => ({
      data: dataTransform(dies, graph, chartsStylesIEPG),
      references: [
        { y: 30, color: '#0f0' },
        { y: 70, color: '#ff0' },
        { y: 100, color: '#f00' }
      ].map(({ y, color }) => (
        <ReferenceLine
          key={`y_${y}`}
          y={y}
          stroke={color}
          strokeDasharray='3 3'
          ifOverflow='extendDomain'
        />
      ))
    }),
    [graph, dies]
  )

  return (
    <Chart syncId='charts' dies={dies} indexValues={indexValues} data={data}>
      {references}
    </Chart>
  )
}

const ChartIEPGPropTypes = {
  graph: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        data: PropTypes.array,
        label: PropTypes.string
      })
    ).isRequired
  }),
  dies: PropTypes.array,
  indexValues: PropTypes.number
}
ChartIEPG.propTypes = ChartIEPGPropTypes
ChartIEPG.defaultProps = {
  graph: { data: [] },
  dies: [],
  indexValues: 0
}

export default ChartIEPG
export { ChartIEPGPropTypes }
