import React from 'react'
import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import Chip from '@material-ui/core/Chip'

import Chart from '../Common/Chart'

// Import charting systems dynamically
import asyncComponent from '../../../asyncComponent'
const ReferenceLine = asyncComponent(() => import('recharts'), 'ReferenceLine')

// Adapt data shape to the expected by `Common/Chart`
const dataTransform = (dies, graph, chartsStyles = []) => {
  const reformatDate = (date) => date.split('/').reverse().join('-')
  const range = [dies[0], dies[dies.length - 1]].map(reformatDate)
  const dates = dies.map(reformatDate)

  return graph.data.map(({ data, label }, index) => ({
    data,
    name: label,
    range,
    dates,
    ...(chartsStyles[index] ?? {})
  }))
}

const chartsStylesIEPG = [{ type: 'line', color: '#000000', width: 3 }]

function ChartIEPG ({ graph, dies, indexValues }) {
  const { data, references } = React.useMemo(
    () => ({
      data: dataTransform(dies, graph, chartsStylesIEPG),
      references: [
        { y: 30, color: '#0f0' },
        { y: 70, color: '#ff0' },
        { y: 100, color: '#f00' }
      ].map(({ y, color }, key) => (
        <ReferenceLine
          key={key}
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
    <Chart syncId='charts' {...{ dies, indexValues, data }}>
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

const chartsStylesExtensio = [
  { type: 'area', order: 1, color: '#648ac8', width: 1 },
  { type: 'area', order: 0, color: '#cacaca', width: 1 },
  { type: 'line', order: 2, color: '#969696', width: 1 }
]

function ChartExtensio ({ graph, dies, indexValues }) {
  const data = React.useMemo(
    () => dataTransform(dies, graph, chartsStylesExtensio),
    [graph, dies]
  )

  return <Chart syncId='charts' {...{ dies, indexValues, data }} />
}

const ChartExtensioPropTypes = ChartIEPGPropTypes
ChartExtensio.propTypes = ChartExtensioPropTypes
ChartExtensio.defaultProps = {
  graph: { data: [] },
  dies: [],
  indexValues: 0
}

function PillsList ({ list }) {
  return list.map(({ key, name }) => (
    <Grid key={key} item>
      <Chip color='primary' size='small' label={name} />
    </Grid>
  ))
}

PillsList.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      name: PropTypes.string
    })
  )
}

function PillsForCache ({ dies, ...props }) {
  const dateStr = dies[dies.length - 1]
  const list = [['dies', dateStr], ...Object.entries(props)].map(
    ([key, name]) => ({ key, name })
  )
  return (
    <Grid
      container
      direction='row'
      alignItems='center'
      justifyContent='center'
      spacing={1}
      style={{ position: 'relative', top: '-2em' }}
    >
      <PillsList list={list} />
    </Grid>
  )
}
const Pills = React.memo(PillsForCache)
const PillsPropTypes = {
  population: PropTypes.string,
  region: PropTypes.string,
  dies: PropTypes.array
}
Pills.propTypes = PillsPropTypes
Pills.defaultProps = {
  population: '',
  region: '',
  dies: []
}

// TODO: Abstract it?
// Copied from Widgets/Common/Chart
const parseDateStr = (dateStr, sep = '/') =>
  dateStr.split(sep).map((d) => Number(d))
const parseDate = ([day, month, year]) => new Date(year, month - 1, day)

function TableSeguimentInternalForCache ({ graph, selectedRows }) {
  return (
    <div style={{ overflowY: 'auto' }}>
      <table>
        <thead>
          <tr>
            {graph.headers.map(({ content, title }, index) => (
              <th key={index} title={title}>
                {content}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {graph.body.map((row, index) => (
            <tr
              key={index}
              style={selectedRows[index] ? { backgroundColor: '#eee' } : {}}
            >
              {row.map(({ content }, cellIndex) => (
                <td key={cellIndex} style={{ textAlign: 'right' }}>
                  {content}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
const TableSeguimentInternal = React.memo(TableSeguimentInternalForCache)

const TableSeguimentInternalGraphPropTypes = PropTypes.shape({
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string,
      title: PropTypes.string
    })
  ).isRequired,
  // [row].[cell].content
  body: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        content: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      })
    )
  ).isRequired
})
const TableSeguimentInternalPropTypes = {
  graph: TableSeguimentInternalGraphPropTypes.isRequired,
  selectedRows: PropTypes.array.isRequired
}
TableSeguimentInternal.propTypes = TableSeguimentInternalPropTypes

function TableSeguiment ({ graph, population, region, dies, indexValues }) {
  // Generate an array containing rows date ranges (as Date)
  const rowDates = React.useMemo(
    () =>
      graph.body.map((row) =>
        row[0].content
          .split(' - ')
          .map((dateStr) => parseDate(parseDateStr(dateStr)))
      ),
    [graph]
  )

  // Find which rows are selected by currently selected day
  const dateStr = dies[indexValues]
  const currentDate = parseDate(parseDateStr(dateStr))
  const selectedRows = rowDates.map(
    (row, index) =>
      currentDate >= rowDates[index][0] && currentDate <= rowDates[index][1]
  )

  // Performance: use useState to cache the selected rows array reference
  const [selectedRowsCached, setSelectedRowsCached] = React.useState(
    rowDates.map(() => false)
  )
  if (
    selectedRows.length !== selectedRowsCached.length ||
    selectedRows.some((row, index) => row !== selectedRowsCached[index])
  ) {
    setSelectedRowsCached(selectedRows)
  }

  // For Pills
  return (
    <>
      <Pills {...{ population, region, dies }} />
      <TableSeguimentInternal graph={graph} selectedRows={selectedRowsCached} />
    </>
  )
}

const TableSeguimentPropTypes = {
  graph: TableSeguimentInternalGraphPropTypes,
  ...PillsPropTypes
}
TableSeguiment.propTypes = TableSeguimentPropTypes
TableSeguiment.defaultProps = {
  graph: { header: [], body: [] }
}

function TableSituacioInternalForCache ({ elements }) {
  return (
    <Grid container direction='row' alignItems='center'>
      {elements.map(({ name, value }, index) => (
        <Grid key={index} item container direction='column' alignItems='center'>
          <Grid item>
            <strong>{name}</strong>
          </Grid>
          <Grid item>{value}</Grid>
        </Grid>
      ))}
    </Grid>
  )
}
const TableSituacioInternal = React.memo(TableSituacioInternalForCache)

const TableSituacioInternalPropTypes = {
  elements: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ).isRequired
}
TableSituacioInternal.propTypes = TableSituacioInternalPropTypes

function TableSituacio ({ graph: { elements }, population, region, dies }) {
  return (
    <>
      <Pills {...{ population, region, dies }} />
      <TableSituacioInternal elements={elements} />
    </>
  )
}

const TableSituacioPropTypes = {
  graph: PropTypes.shape(TableSituacioInternalPropTypes),
  ...PillsPropTypes
}
TableSituacio.propTypes = TableSituacioPropTypes
TableSituacio.defaultProps = {
  graph: { elements: [] }
}

const GraphFromDataset = {
  grafic_risc_iepg: {
    component: ChartIEPG,
    propTypes: ChartIEPGPropTypes
  },
  grafic_extensio: {
    component: ChartExtensio,
    propTypes: ChartExtensioPropTypes
  },
  situacio: {
    component: TableSituacio,
    propTypes: TableSituacioPropTypes
  },
  seguiment: {
    component: TableSeguiment,
    propTypes: TableSeguimentPropTypes
  }
}

function MultiChart ({ dataset, valors, ...restProps }) {
  const ChartComponent = GraphFromDataset[dataset].component
  return <ChartComponent graph={valors[dataset]} {...restProps} />
}

MultiChart.propTypes = {
  dataset: PropTypes.oneOf(Object.keys(GraphFromDataset)).isRequired,
  valors: PropTypes.shape(
    Object.entries(GraphFromDataset).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: PropTypes.shape(value.propTypes)
      }),
      {}
    )
  )
}

export default MultiChart
