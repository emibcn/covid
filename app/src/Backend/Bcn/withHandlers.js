import withHandlerGenerator from '../Base/withHandlerGenerator'
import { withHandler } from './context'

// Index HOC
const withIndex = (WrappedComponent, name = 'index') =>
  withHandlerGenerator(
    withHandler,
    () => ({}),
    (props, Handler, setIndex) => Handler.index(setIndex),
    name,
    WrappedComponent
  )

// Data HOC
const withData = (WrappedComponent, name = 'bcnData') => {
  const WrapperComponent = withHandlerGenerator(
    withHandler,
    ({ dataset }) => ({ dataset }),
    ({ dataset }, Handler, setData) => Handler.data(dataset, setData),
    name,
    WrappedComponent
  )

  WrapperComponent.defaultProps = WrappedComponent.defaultProps

  return WrapperComponent
}

export { withIndex, withData }
