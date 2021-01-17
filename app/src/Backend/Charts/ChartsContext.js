import React, { createContext, useContext } from 'react';
import ChartsData from './index';

const ChartsContext = createContext();

const ChartsProvider = ({children}) => (
  <ChartsContext.Provider value={ChartsData}>
    {children}
  </ChartsContext.Provider>
);

const useChartsData = () => {
  const context = useContext(ChartsContext);

  if (context === undefined) {
    throw new Error('useChartsData must be used within a ChartsProvider');
  }

  return context;
};

const ChartsConsumer = ({children}) => children(useChartsData());

const withChartsDataHandler = (WrappedComponent, name="chartsDataHandler") => (props) => (
  <ChartsContext.Consumer>
    {context => <WrappedComponent {...props} { ...{[name]: context} } />}
  </ChartsContext.Consumer>
);

export default ChartsProvider;
export { withChartsDataHandler, ChartsConsumer, useChartsData, ChartsContext };
