import 'simplebar-react/dist/simplebar.min.css';

import { AuthConsumer, AuthProvider } from 'src/contexts/auth-context';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CacheProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import Head from 'next/head';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ReactQueryProvider from 'src/lib/react-query';
import SocketClient from 'src/lib/socket-io';
import { ThemeProvider } from '@mui/material/styles';
import { Toaster } from 'react-hot-toast';
import { createEmotionCache } from 'src/utils/create-emotion-cache';
import { createTheme } from 'src/theme';
import { useNProgress } from 'src/hooks/use-nprogress';

const clientSideEmotionCache = createEmotionCache();

const SplashScreen = () => null;

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  useNProgress();

  const getLayout = Component.getLayout ?? ((page) => page);

  const theme = createTheme();

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>PTIT - BANKING</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ReactQueryProvider>
          <AuthProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <AuthConsumer>
                {(auth) =>
                  auth.isLoading ? (
                    <SplashScreen />
                  ) : (
                    getLayout(<Component {...pageProps} />)
                  )
                }
              </AuthConsumer>
            </ThemeProvider>
            <Toaster />
          </AuthProvider>
        </ReactQueryProvider>
      </LocalizationProvider>
    </CacheProvider>
  );
};

export default App;
