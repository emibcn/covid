import React from 'react'

import Loading from '../../Loading'

// HOC generator
const withHandlerGenerator = (
  withBackendHandlerHOC,
  relevantParams,
  getValue,
  name,
  WrappedComponent
) => {
  // Functional wrapper component
  const WithValue = ({ BackendHandler, ...props }) => {
    const [value, setValue] = React.useState(false)
    const [params, setParams] = React.useState(relevantParams(props))

    // Find if any relevant prop (param=relevant prop) has changed
    const newParams = relevantParams(props)
    if (
      Object.keys(newParams).some((param) => newParams[param] !== params[param])
    ) {
      setParams(newParams)
    }

    // Subscribe to index updates
    // Return unsubscribing function to let React execute it on cleanup
    React.useEffect(
      () => {
        setValue(false)
        return getValue(params, BackendHandler, setValue)
      },
      // Only execute on mount and on relevant props (param) change
      [BackendHandler, params]
    )

    return value === false
      ? (
        <Loading />
        )
      : (
        <WrappedComponent {...props} {...{ [name]: value }} />
        )
  }

  // Return wrapper component wrapped with a
  // HOC providing the backend handler as a prop
  return withBackendHandlerHOC(WithValue, 'BackendHandler')
}

export default withHandlerGenerator
