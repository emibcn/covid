import React from 'react'
import PropTypes from 'prop-types'

import ChartIEPG, { ChartIEPGPropTypes } from './ChartIEPG'
import ChartExtensio, { ChartExtensioPropTypes } from './ChartExtensio'
import TableSituacio, { TableSituacioPropTypes } from './TableSituacio'
import TableSeguiment, { TableSeguimentPropTypes } from './TableSeguiment'

const GraphFromDataset = {
  grafic_risc_iepg: {
    component: ChartIEPG,
    types: ChartIEPGPropTypes
  },
  grafic_extensio: {
    component: ChartExtensio,
    types: ChartExtensioPropTypes
  },
  situacio: {
    component: TableSituacio,
    types: TableSituacioPropTypes
  },
  seguiment: {
    component: TableSeguiment,
    types: TableSeguimentPropTypes
  }
}

function MultiChart ({ dataset, valors, ...restProps }) {
  const ChartComponent = GraphFromDataset[dataset].component
  return <ChartComponent graph={valors[dataset]} {...restProps} />
}

const MultiChartpropTypes = {
  dataset: PropTypes.oneOf(Object.keys(GraphFromDataset)).isRequired,
  valors: PropTypes.shape(
    Object.entries(GraphFromDataset).reduce(
      (acc, [key, {types}]) => ({
        ...acc,
        [key]: PropTypes.shape(types)
      }),
      {}
    )
  )
}

MultiChart.propTypes = MultiChartpropTypes

MultiChart.defaultProps = {
  valors: []
}

export default MultiChart
export MultiChartpropTypes
