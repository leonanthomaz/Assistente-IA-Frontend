import { ThemeProvider } from 'styled-components';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter } from 'react-router-dom';

import { GlobalStyle } from './styles/global';
import { theme } from './styles/theme';
import { AuthProvider } from './contexts/AuthContext';
import { GlobalProvider } from './contexts/GlobalContext';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={3000}
      >
        <BrowserRouter>
          <AuthProvider>
            <GlobalProvider>
              <AppRouter />
            </GlobalProvider>
          </AuthProvider>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;