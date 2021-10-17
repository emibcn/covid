import React from 'react'

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

function ChartIEPG (props) {
  const { graph, dies, indexValues } = props
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

const chartsStylesExtensio = [
  { type: 'area', order: 1, color: '#648ac8', width: 1 },
  { type: 'area', order: 0, color: '#cacaca', width: 1 },
  { type: 'line', order: 2, color: '#969696', width: 1 }
]

function ChartExtensio (props) {
  const { graph, dies, indexValues } = props
  const data = React.useMemo(
    () => dataTransform(dies, graph, chartsStylesExtensio),
    [graph, dies]
  )

  return <Chart syncId='charts' {...{ dies, indexValues, data }} />
}

function PillsForCache ({ dies, ...props }) {
  const dateStr = dies[dies.length - 1]
  return (
    <Grid
      container
      direction='row'
      alignItems='center'
      justify='center'
      spacing={1}
      style={{ position: 'relative', top: '-2em' }}
    >
      {[dateStr, ...Object.values(props)].map((name, index) => (
        <Grid key={index} item>
          <Chip color='primary' size='small' label={name} />
        </Grid>
      ))}
    </Grid>
  )
}
const Pills = React.memo(PillsForCache)

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

function TableSeguiment ({ graph, ...props }) {
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
  const { dies, indexValues } = props
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
  const { population, region } = props
  return (
    <>
      <Pills {...{ population, region, dies }} />
      <TableSeguimentInternal graph={graph} selectedRows={selectedRowsCached} />
    </>
  )
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

function TableSituacio ({ graph, ...props }) {
  // For Pills
  const { population, region, dies } = props
  return (
    <>
      <Pills {...{ population, region, dies }} />
      <TableSituacioInternal elements={graph.elements} />
    </>
  )
}

const GraphFromDataset = {
  grafic_risc_iepg: ChartIEPG,
  grafic_extensio: ChartExtensio,
  situacio: TableSituacio,
  seguiment: TableSeguiment
}

function MultiChart (props) {
  const { dataset, valors, ...restProps } = props
  const ChartDataset = GraphFromDataset[dataset]
  return <ChartDataset graph={valors[dataset]} {...restProps} />
}

export default MultiChart
