import React, { createContext, useContext } from 'react';
import Handler from './index';
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
    throw new Error('Handler must be used within a BcnProvider');
  }

  return context;
}

const Consumer = ({children}) => children(useHandler());

const withHandler = (WrappedComponent, name="bcnDataHandler") => (props) => (
  <Consumer>
    {context => <WrappedComponent {...props} { ...{[name]: context} } />}
  </Consumer>
);

export default Provider;
export { withHandler, Consumer, useHandler, Context, withIndex, withData };
