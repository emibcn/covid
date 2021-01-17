import withHandlerGenerator from '../Base/withHandlerGenerator';
import { withMapsDataHandler } from './MapsContext';

// Index HOC
const withIndex = (WrappedComponent, name="days") =>
  withHandlerGenerator(
    withMapsDataHandler,
    () => ({}),
    (props, MapsHandler, setIndex) => {
      const handler = new MapsHandler();
      return handler.index( setIndex );
    },
    name,
    WrappedComponent,
  );

// Data HOC
const withData = (WrappedComponent, name="mapData") => {
  const WrapperComponent = withHandlerGenerator(
    withMapsDataHandler,
    ({mapKind, mapValue}) => ({mapKind, mapValue}),
    ({mapKind, mapValue}, MapsHandler, setData) => {
      const handler = new MapsHandler();
      return handler.data( mapKind, mapValue, setData )
    },
    name,
    WrappedComponent,
  );

  return WrapperComponent;
}

export {withIndex, withData};
