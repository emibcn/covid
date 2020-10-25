import React from "react";

import BcnProvider from './Bcn/BcnContext';
import MapsProvider from './Maps/MapsContext';
import ChartsProvider from './Charts/ChartsContext';

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
