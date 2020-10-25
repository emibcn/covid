import React, { Component } from 'react';
import MapsData from './index';

const MapsContext = React.createContext();

function MapsProvider({children}) {
  return (
    <MapsContext.Provider value={MapsData}>
      {children}
    </MapsContext.Provider>
  );
}

function MapsConsumer({children}) {
  return (
    <MapsContext.Consumer>
      {context => {
        if (context === undefined) {
          throw new Error('MapsConsumer must be used within a MapsProvider');
        }

        return children(context);
      }}
    </MapsContext.Consumer>
  );
}

function useMapsData() {
  const context = React.useContext(MapsContext);

  if (context === undefined) {
    throw new Error('useMapsData must be used within a MapsProvider');
  }

  return context;
}

function withMapsDataHandler(WrappedComponent) {
  return (
    class GetMapsData extends Component {
      render() {
        return (
          <MapsContext.Consumer>
            {context => {
              if (context === undefined) {
                throw new Error('MapsConsumer must be used within a MapsProvider');
              }

              return <WrappedComponent {...this.props} mapsDataHandler={context} />;
            }}
          </MapsContext.Consumer>
        );
      }
    }
  );
}

export default MapsProvider;
export { withMapsDataHandler, MapsConsumer, useMapsData, MapsContext };
