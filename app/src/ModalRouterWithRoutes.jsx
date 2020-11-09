import React from 'react';
import { Route } from 'react-router-dom';

import ModalRouter from './ModalRouter';
import { withErrorCatcher } from './ErrorCatcher';
import About from './About';
import Language from './Language';

const ModalRouterWithRoutes = (props) => {
  const { language, onLanguageChange } = props.routeProps;
  return (
    <ModalRouter force={ false } >
      <Route
        exact
        path='about'
        render={ props => withErrorCatcher('About', <About />) }
      />
      <Route
        exact
        path="language"
        render={(props) =>
          withErrorCatcher(
            "Language",
            <Language language={language} onLanguageChange={onLanguageChange} />
          )
        }
      />
    </ModalRouter>
  )
};

export default ModalRouterWithRoutes;
