import React, { Component } from 'react';
import ChartsData from './index';

const ChartsContext = React.createContext();

function ChartsProvider({children}) {
  return (
    <ChartsContext.Provider value={ChartsData}>
      {children}
    </ChartsContext.Provider>
  );
}

function ChartsConsumer({children}) {
  return (
    <ChartsContext.Consumer>
      {context => {
        if (context === undefined) {
          throw new Error('ChartsConsumer must be used within a ChartsProvider');
        }

        return children(context);
      }}
    </ChartsContext.Consumer>
  );
}

function useChartsData() {
  const context = React.useContext(ChartsContext);

  if (context === undefined) {
    throw new Error('useChartsData must be used within a ChartsProvider');
  }

  return context;
}

function withChartsDataHandler(WrappedComponent) {
  return (
    class GetChartsData extends Component {
      render() {
        return (
          <ChartsContext.Consumer>
            {context => {
              if (context === undefined) {
                throw new Error('ChartsConsumer must be used within a ChartsProvider');
              }

              return <WrappedComponent {...this.props} chartsDataHandler={context} />;
            }}
          </ChartsContext.Consumer>
        );
      }
    }
  );
}

export default ChartsProvider;
export { withChartsDataHandler, ChartsConsumer, useChartsData, ChartsContext };
