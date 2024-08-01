/* eslint-disable perfectionist/sort-imports */
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';
import { store, persistor } from './app/store';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <ToastContainer stacked style={{ marginTop: '100px' }} />
          <Router />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
