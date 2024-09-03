/* eslint-disable perfectionist/sort-imports */
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';

import Router from 'src/routes/sections';
import { store, persistor } from './app/store';
import { palette } from './theme/palette';
import { typography } from './theme/typography';
import { shadows } from './theme/shadows';
import { customShadows } from './theme/custom-shadows';
import { overrides } from './theme/overrides';

// ----------------------------------------------------------------------

function ThemeProvider({ children }) {
  const memoizedValue = useMemo(
    () => ({
      palette: palette(),
      typography,
      shadows: shadows(),
      customShadows: customShadows(),
      shape: { borderRadius: 8 },
    }),
    []
  );

  const theme = createTheme(memoizedValue);

  theme.components = overrides(theme);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
};

export default function App() {
  useScrollToTop();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <ToastContainer stacked style={{ marginTop: 60 }} />
          <Router />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
