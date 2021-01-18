import React from "react";

import BcnProvider from './Bcn/context';
import MapsProvider from './Maps/context';
import ChartsProvider from './Charts/context';

const BackendProvider = ({children}) => {
  return (
    <BcnProvider>
      <MapsProvider>
        <ChartsProvider>
          {children}
        </ChartsProvider>
      </MapsProvider>
    </BcnProvider>
  );
};

export default BackendProvider;
