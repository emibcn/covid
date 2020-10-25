import React, { Component } from 'react';
import BcnData from './index';

const BcnContext = React.createContext();

function BcnProvider({children}) {
  return (
    <BcnContext.Provider value={BcnData}>
      {children}
    </BcnContext.Provider>
  );
}

function BcnConsumer({children}) {
  return (
    <BcnContext.Consumer>
      {context => {
        if (context === undefined) {
          throw new Error('BcnConsumer must be used within a BcnProvider');
        }

        return children(context);
      }}
    </BcnContext.Consumer>
  );
}

function useBcnData() {
  const context = React.useContext(BcnContext);

  if (context === undefined) {
    throw new Error('useBcnData must be used within a BcnProvider');
  }

  return context;
}

function withBcnDataHandler(WrappedComponent) {
  return (
    class GetBcnData extends Component {
      render() {
        return (
          <BcnContext.Consumer>
            {context => {
              if (context === undefined) {
                throw new Error('BcnConsumer must be used within a BcnProvider');
              }

              return <WrappedComponent {...this.props} bcnDataHandler={context} />;
            }}
          </BcnContext.Consumer>
        );
      }
    }
  );
}

export default BcnProvider;
export { withBcnDataHandler, BcnConsumer, useBcnData, BcnContext };
