import withHandlerGenerator from '../Base/withHandlerGenerator';
import { withBcnDataHandler } from './BcnContext';

// Index HOC
const withIndex = (WrappedComponent, name="index") =>
  withHandlerGenerator(
    withBcnDataHandler,
    () => ({}),
    (props, BcnHandler, setIndex) => {
      const handler = new BcnHandler();
      return handler.index( setIndex );
    },
    name,
    WrappedComponent,
  );

// Data HOC
const withData = (WrappedComponent, name="bcnData") => {
  const WrapperComponent = withHandlerGenerator(
    withBcnDataHandler,
    ({dataset, bcnIndex}) =>
      ({dataset, bcnIndex}),
    ({dataset, bcnIndex}, BcnHandler, setData) => {
      const handler = new BcnHandler(bcnIndex);
      return handler.data( dataset, setData )
    },
    name,
    WrappedComponent,
  );

  WrapperComponent.defaultProps = WrappedComponent.defaultProps;

  return WrapperComponent;
}

export {withIndex, withData};
