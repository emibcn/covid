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
const withData = (WrappedComponent, name = 'chartData') => {
  const WrapperComponent = withHandlerGenerator(
    withHandler,
    ({ chartDivision, chartPopulation, chartRegion }) => ({
      chartDivision,
      chartPopulation,
      chartRegion
    }),
    ({ chartDivision, chartPopulation, chartRegion }, Handler, setData) =>
      Handler.data(chartDivision, chartPopulation, chartRegion, setData),
    name,
    WrappedComponent
  )

  WrapperComponent.defaultProps = WrappedComponent.defaultProps

  return WrapperComponent
}

export { withIndex, withData }
