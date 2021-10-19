import React from "react";
import PropTypes from "prop-types";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

const AppThemeProvider = (props) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const { type, children } = props;

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          type: type || (prefersDarkMode ? "dark" : "light"),
        },
      }),
    [prefersDarkMode, type]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

AppThemeProvider.propTypes = {
  type: PropTypes.oneOf(["light", "dark", false]),
};

export default AppThemeProvider;
