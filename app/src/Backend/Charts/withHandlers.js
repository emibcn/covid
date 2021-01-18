import withHandlerGenerator from '../Base/withHandlerGenerator';
import { withHandler } from './context';

// Index HOC
const withIndex = (WrappedComponent, name="index") =>
  withHandlerGenerator(
    withHandler,
    () => ({}),
    (props, Handler, setIndex) => {
      const handler = new Handler();
      return handler.index( setIndex );
    },
    name,
    WrappedComponent,
  );

// Data HOC
const withData = (WrappedComponent, name="chartData") => {
  const WrapperComponent = withHandlerGenerator(
    withHandler,
    ({chartDivision, chartPopulation, chartRegion, chartsIndex}) =>
      ({chartDivision, chartPopulation, chartRegion, chartsIndex}),
    ({chartDivision, chartPopulation, chartRegion, chartsIndex}, Handler, setData) => {
      const handler = new Handler(chartsIndex);
      return handler.data( chartDivision, chartPopulation, chartRegion, setData )
    },
    name,
    WrappedComponent,
  );

  WrapperComponent.defaultProps = WrappedComponent.defaultProps;

  return WrapperComponent;
}

export {withIndex, withData};
