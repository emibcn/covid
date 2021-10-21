import React from 'react'
import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const Icon = <FontAwesomeIcon icon={faTrash} />

// Used to remove a widget from the Dashboard
function Remove ({ id, onRemove, t }) {
  const handleRemove = () => onRemove(id)
  return (
    <Button
      startIcon={Icon}
      onClick={handleRemove}
      variant='contained'
      color='primary'
      aria-label={t('remove')}
    >
      {t('Confirm removal')}
    </Button>
  )
}

const RemovePropTypes = {
  id: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
}

Remove.propTypes = RemovePropTypes

export default Remove
export {RemovePropTypes, Icon}
