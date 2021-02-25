import React from "react";

import BcnProvider from './Bcn/context';
import MapsProvider from './Maps/context';
import ChartsProvider from './Charts/context';

const BackendProvider = ({children, bcn, maps, charts}) => {
  return (
    <BcnProvider value={bcn}>
      <MapsProvider value={maps}>
        <ChartsProvider value={charts}>
          {children}
        </ChartsProvider>
      </MapsProvider>
    </BcnProvider>
  );
};

export default BackendProvider;
