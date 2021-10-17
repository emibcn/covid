import React from 'react'
import { Route } from 'react-router-dom'

import ModalRouter from './ModalRouter'
import { withErrorCatcher } from './ErrorCatcher'
import About from './About'
import Language from './Language'
import Theme from './Theme'

const ModalRouterWithRoutes = (props) => {
  const { language, onLanguageChange, theme, onThemeChange } = props.routeProps
  return (
    <ModalRouter force={false}>
      <Route
        exact
        path='about'
        render={() => withErrorCatcher('About', <About />)}
      />
      <Route
        exact
        path='language'
        render={() =>
          withErrorCatcher(
            'Language',
            <Language language={language} onLanguageChange={onLanguageChange} />
          )}
      />
      <Route
        exact
        path='theme'
        render={() =>
          withErrorCatcher(
            'Theme',
            <Theme theme={theme} onThemeChange={onThemeChange} />
          )}
      />
    </ModalRouter>
  )
}

export default ModalRouterWithRoutes
