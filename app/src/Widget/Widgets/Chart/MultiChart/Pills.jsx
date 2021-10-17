import React from 'react'
import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import Chip from '@material-ui/core/Chip'

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
const PillsPropTypes = {
  population: PropTypes.string,
  region: PropTypes.string,
  dies: PropTypes.array
}
PillsForCache.propTypes = PillsPropTypes
PillsForCache.defaultProps = {
  population: '',
  region: '',
  dies: []
}
const Pills = React.memo(PillsForCache)

export default Pills
export { PillsPropTypes }
