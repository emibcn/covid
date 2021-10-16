import React from 'react'
import { PropTypes } from 'prop-types'

import LocalStorageProvider from './StorageContextProviderLocalStorage'
import RouterProviderWithSwitch from './StorageContextProviderRouter'

// Combine both providers
const ContextProvider = (props) => {
  const { children, pathFilter, paramsFilter, paramsToString } = props
  return (
    <LocalStorageProvider>
      <RouterProviderWithSwitch
        {...{ pathFilter, paramsFilter, paramsToString }}
      >
        {children}
      </RouterProviderWithSwitch>
    </LocalStorageProvider>
  )
}

ContextProvider.propTypes = {
  // How to handle URL hash storage
  pathFilter: PropTypes.string.isRequired,
  paramsFilter: PropTypes.func.isRequired,
  paramsToString: PropTypes.func.isRequired
}

export default ContextProvider
