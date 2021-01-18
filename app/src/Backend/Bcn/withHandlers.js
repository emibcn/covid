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
const withData = (WrappedComponent, name="bcnData") => {
  const WrapperComponent = withHandlerGenerator(
    withHandler,
    ({dataset, bcnIndex}) =>
      ({dataset, bcnIndex}),
    ({dataset, bcnIndex}, Handler, setData) => {
      const handler = new Handler(bcnIndex);
      return handler.data( dataset, setData )
    },
    name,
    WrappedComponent,
  );

  WrapperComponent.defaultProps = WrappedComponent.defaultProps;

  return WrapperComponent;
}

export {withIndex, withData};
