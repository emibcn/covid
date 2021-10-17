import React from 'react'
import PropTypes from 'prop-types'

import Pills, { PillsPropTypes } from './Pills'

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
            {graph.headers.map(({ content, title }) => (
              <th
                key={(typeof content !== 'undefined'
                  ? content
                  : 'undef'
                ).replace(/[^a-zA-Z0-9]/gm, '_')}
                title={title}
              >
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
              {row.map(({ content }, indexRow) => (
                <td key={indexRow} style={{ textAlign: 'right' }}>
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
  selectedRows: PropTypes.arrayOf(PropTypes.bool).isRequired
}
TableSeguimentInternalForCache.propTypes = TableSeguimentInternalPropTypes

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
      <Pills population={population} region={region} dies={dies} />
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

export default TableSeguiment
export { TableSeguimentPropTypes }
