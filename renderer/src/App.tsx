import { useEffect, useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';
import { createTheme, MantineProvider, Card, Container } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalAnchor } from './components/ModalAnchor';
import { usePromise } from './hooks/usePromise';
import { usePreferences } from './hooks/usePreferences';
import { router } from './routes';
import { fileManager } from './utils/FileManager';
import { APP_REGION_HEIGHT } from './constants';

const init = () => fileManager.load();

export function App() {
  const ready = usePromise(init);
  const theme = usePreferences('theme');

  const mantineTheme = useMemo(() => {
    return createTheme({
      /** Put your mantine theme override here */
      components: {
        Card: Card.extend({
          defaultProps: {
            shadow: 'sm',
            withBorder: !theme.darkMode
          }
        }),
        Container: Container.extend({
          defaultProps: {
            maw: theme.pageWidth
          }
        })
      },
      primaryColor: theme.primaryColor
    });
  }, [theme.darkMode, theme.pageWidth, theme.primaryColor]);

  useEffect(() => {
    document.documentElement.style.setProperty('--app-region-height', `${APP_REGION_HEIGHT}px`);
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${theme.fontSize}px`;
  }, [theme.fontSize]);

  useEffect(() => {
    document.documentElement.setAttribute('data-primary-color', theme.primaryColor);
  }, [theme.primaryColor]);

  return (
    <MantineProvider theme={mantineTheme} forceColorScheme={theme.darkMode ? 'dark' : 'light'}>
      {ready && <RouterProvider router={router} />}
      <Notifications containerWidth={400} position="top-right" />
      <ModalAnchor />
    </MantineProvider>
  );
}
