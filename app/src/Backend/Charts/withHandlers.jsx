import withHandlerGenerator from '../Base/withHandlerGenerator';
import { withChartsDataHandler } from './ChartsContext';

// Index HOC
const withIndex = (WrappedComponent, name="index") =>
  withHandlerGenerator(
    withChartsDataHandler,
    () => ({}),
    (props, ChartsHandler, setIndex) => {
      const handler = new ChartsHandler();
      return handler.index( setIndex );
    },
    name,
    WrappedComponent,
  );

// Data HOC
const withData = (WrappedComponent, name="chartData") => {
  const WrapperComponent = withHandlerGenerator(
    withChartsDataHandler,
    ({chartDivision, chartPopulation, chartRegion, chartsIndex}) =>
      ({chartDivision, chartPopulation, chartRegion, chartsIndex}),
    ({chartDivision, chartPopulation, chartRegion, chartsIndex}, ChartsHandler, setData) => {
      const handler = new ChartsHandler(chartsIndex);
      return handler.data( chartDivision, chartPopulation, chartRegion, setData )
    },
    name,
    WrappedComponent,
  );

  WrapperComponent.defaultProps = WrappedComponent.defaultProps;

  return WrapperComponent;
}

export {withIndex, withData};
