import withHandlerGenerator from '../Base/withHandlerGenerator'
import { withHandler } from './context'

// Index HOC
const withIndex = (WrappedComponent, name = 'days') =>
  withHandlerGenerator(
    withHandler,
    () => ({}),
    (props, Handler, setIndex) => Handler.index(setIndex),
    name,
    WrappedComponent
  )

// Data HOC
const withData = (WrappedComponent, name = 'mapData') => {
  const WrapperComponent = withHandlerGenerator(
    withHandler,
    ({ mapKind, mapValue }) => ({ mapKind, mapValue }),
    ({ mapKind, mapValue }, Handler, setData) => {
      return Handler.data(mapKind, mapValue, (data) => {
        // Optimization: Transform received data to use Map()
        // instead of Object() in days values
        const newData = {
          ...data,
          valors: data.valors.map(
            (dayValues) => new Map(Object.entries(dayValues))
          )
        }
        return setData(newData)
      })
    },
    name,
    WrappedComponent
  )

  return WrapperComponent
}

export { withIndex, withData }
