import withHandlerGenerator from '../Base/withHandlerGenerator';
import { withHandler } from './context';

// Index HOC
const withIndex = (WrappedComponent, name="days") =>
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
const withData = (WrappedComponent, name="mapData") => {
  const WrapperComponent = withHandlerGenerator(
    withHandler,
    ({mapKind, mapValue}) => ({mapKind, mapValue}),
    ({mapKind, mapValue}, Handler, setData) => {
      const handler = new Handler();
      return handler.data( mapKind, mapValue, setData )
    },
    name,
    WrappedComponent,
  );

  return WrapperComponent;
}

export {withIndex, withData};
