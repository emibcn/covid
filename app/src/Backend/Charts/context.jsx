import React, { createContext, useContext } from 'react';
import Handler from './handler';
import {withIndex, withData} from './withHandlers';

const Context = createContext();

const Provider = ({children}) => (
  <Context.Provider value={Handler}>
    {children}
  </Context.Provider>
);

const useHandler = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('useHandler must be used within a ChartsProvider');
  }

  return context;
};

const Consumer = ({children}) => children(useHandler());

const withHandler = (WrappedComponent, name="chartsDataHandler") => (props) => (
  <Consumer>
    {context => <WrappedComponent {...props} { ...{[name]: context} } />}
  </Consumer>
);

export default Provider;
export { withHandler, Consumer, useHandler, Context, withIndex, withData };
