import React, { createContext, useContext } from 'react';
import MapsData from './index';

const MapsContext = createContext();

const MapsProvider = ({children}) => (
  <MapsContext.Provider value={MapsData}>
    {children}
  </MapsContext.Provider>
);

const useMapsData = () => {
  const context = useContext(MapsContext);

  if (context === undefined) {
    throw new Error('MapsData must be used within a MapsProvider');
  }

  return context;
}

const MapsConsumer = ({children}) => children(useMapsData())

const withMapsDataHandler = (WrappedComponent) => (props) => (
  <MapsConsumer>
    {context =>  <WrappedComponent {...props} mapsDataHandler={context} />}
  </MapsConsumer>
);

export default MapsProvider;
export { withMapsDataHandler, MapsConsumer, useMapsData, MapsContext };
