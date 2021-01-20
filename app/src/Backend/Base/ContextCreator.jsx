import React, { createContext, useContext } from 'react';

const ContextCreator = (Handler, defaultName) => {
  const Context = createContext();
  
  const Provider = ({children}) => (
    <Context.Provider value={Handler}>
      {children}
    </Context.Provider>
  );
  
  const useHandler = () => {
    const context = useContext(Context);
  
    if (context === undefined) {
      throw new Error(`Handler must be used within a ${defaultName} Provider`);
    }
  
    return context;
  }
  
  const Consumer = ({children}) => children(useHandler());
  
  const withHandler = (WrappedComponent, name=defaultName) => (props) => (
    <Consumer>
      {context => <WrappedComponent {...props} { ...{[name]: context} } />}
    </Consumer>
  );

  return {
    Provider,
    withHandler,
    Consumer,
    useHandler,
    Context,
  };
}

export default ContextCreator;
