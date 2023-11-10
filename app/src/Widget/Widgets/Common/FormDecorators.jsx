import React from 'react'
import PropTypes from 'prop-types'

import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'

import { makeStyles } from '@material-ui/core/styles'

// UI-Material Styles
const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  labelFixed: {
    position: 'initial',
    transform: 'unset',
    marginBottom: theme.spacing(2)
  }
}))

const FormDecorators = (props) => {
  const classes = useStyles()
  const { label, help, id, children, fixTree } = props
  return (
    <div
      style={{
        margin: '0 auto',
        display: 'block'
      }}
    >
      <FormControl required className={classes.formControl}>
        <InputLabel
          className={fixTree ? classes.labelFixed : null}
          htmlFor={id}
        >
          {label}
        </InputLabel>
        {children}
        {help
          ? (
            <FormHelperText id={`helper-text-${id}`}>{help}</FormHelperText>
            )
          : null}
      </FormControl>
    </div>
  )
}

FormDecorators.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  help: PropTypes.string,
  fixTree: PropTypes.bool
}

export default FormDecorators
