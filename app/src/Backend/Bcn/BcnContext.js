import React, { createContext, useContext } from 'react';
import BcnData from './index';

const BcnContext = createContext();

const BcnProvider = ({children}) => (
  <BcnContext.Provider value={BcnData}>
    {children}
  </BcnContext.Provider>
);

const useBcnData = () => {
  const context = useContext(BcnContext);

  if (context === undefined) {
    throw new Error('BcnData must be used within a BcnProvider');
  }

  return context;
}

const BcnConsumer = ({children}) => children(useBcnData());

const withBcnDataHandler = (WrappedComponent, name="bcnDataHandler") => (props) => (
  <BcnConsumer>
    { context => <WrappedComponent {...props} { ...{[name]: context} } /> }
  </BcnConsumer>
);

export default BcnProvider;
export { withBcnDataHandler, BcnConsumer, useBcnData, BcnContext };
