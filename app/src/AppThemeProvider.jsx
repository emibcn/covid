import React from 'react';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const AppThemeProvider = (props) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const { type, children } = props;

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: type ?
                  type :
                  prefersDarkMode ?
                    'dark' :
                    'light',
        },
      }),
    [prefersDarkMode, type],
  );

  return (
    <ThemeProvider theme={ theme }>
      <CssBaseline />
      { children }
    </ThemeProvider>
  );
}

export default AppThemeProvider;
