import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import LegendElement from './LegendElement'

const useStyles = makeStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.background.default,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.text.hint,
    ...theme.shape,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    padding: theme.spacing(1)
  },
  legend: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    padding: 0,
    marginTop: theme.spacing(1)
  },
  legendElement: {
    paddingRight: theme.spacing(1)
  },
  label: {
    ...theme.typography.subtitle1
  }
}))

const Element = ({ name, value, color, unit, gridOptions }) => {
  const withUnit = (value) =>
    `${value ?? ''}${value !== undefined && unit ? unit : ''}`
  const nameWithValue = `${name}: ${withUnit(value)}`
  return (
    <Grid item {...gridOptions}>
      <LegendElement justify='flex-start' color={color} value={nameWithValue} />
    </Grid>
  )
}

Element.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string.isRequired,
  unit: PropTypes.string,
  gridOption: PropTypes.object
}

const List = ({ payload }) => {
  return (
    <Grid container direction='column' justify='center' alignItems='flex-start'>
      {payload.map((pl, index) => (
        <Element key={index} {...pl} />
      ))}
    </Grid>
  )
}

List.defaultProps = {
  payload: []
}

List.propTypes = {
  payload: PropTypes.arrayOf(
    PropTypes.exact(
      Element.propTypes
    )
  )
}
const ChartLegend = (props) => {
  const { payload, data, indexValues, colors } = props
  const classes = useStyles()
  const payloadModified = React.useMemo(
    () =>
      (payload || []).map((line, index) => ({
        ...line,
        unit: line.format?.replace(/^\{[^}]*\}/, '').trim() /* "{,.2f}€" */,
        color: line.color ?? colors[index],
        value:
          data[indexValues] !== undefined
            ? data[indexValues][`v${index}`]
            : undefined
      })),
    [payload, data, indexValues, colors]
  )

  /*
    - Center the elements list in a 11xs container with a 1xs free left
      space and 1xs on each element' right padding (at legend center and right)
    - Show 2 elements per column, or only 1 if there is only one element in the list
  */
  return (
    <Grid container direction='column' alignItems='flex-end'>
      <Grid
        item
        xs={11}
        container
        direction='row'
        justify='flex-start'
        alignItems='center'
        className={classes.legend}
      >
        {payloadModified.map((pl, index) => (
          <Element
            key={index}
            gridOptions={{
              xs: payloadModified.length > 1 ? 6 : 12,
              className: classes.legendElement
            }}
            {...pl}
          />
        ))}
      </Grid>
    </Grid>
  )
}

ChartLegend.defaultProps = {
  label: '',
  payload: [],
  data: []
}

ChartLegend.propTypes = {
  label: PropTypes.string.isRequired,
  payload: PropTypes.array.isRequired,
  indexValues: PropTypes.number.isRequired,
  colors: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired
}

const ChartTooltip = ({ active, payload, label }) => {
  const classes = useStyles()
  return active ? (
    <div className={classes.tooltip}>
      <p className={classes.label}>{label}</p>
      <List payload={payload} />
    </div>
  ) : null
}

ChartTooltip.defaultProps = {
  label: '',
  payload: []
}

ChartTooltip.propTypes = {
  active: PropTypes.bool,
  label: PropTypes.string.isRequired,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      color: PropTypes.string.isRequired,
      unit: PropTypes.string
    })
  ).isRequired
}

export default ChartTooltip
export { ChartLegend }
