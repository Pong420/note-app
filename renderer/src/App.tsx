import { useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';
import { createTheme, MantineProvider, Card, Container } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalAnchor } from './components/ModalAnchor';
import { usePromise } from './hooks/usePromise';
import { usePreferences } from './hooks/usePreferences';
import { router } from './routes';
import { fileManager } from './utils/FileManager';

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

  // FIXME:
  // globalStyles() {
  //   return {
  //     body: {
  //       fontSize: theme.fontSize
  //     }
  //   };
  // }

  return (
    <MantineProvider theme={mantineTheme} forceColorScheme={theme.darkMode ? 'dark' : 'light'}>
      {ready && <RouterProvider router={router} />}
      <Notifications containerWidth={400} position="top-right" />
      <ModalAnchor />
    </MantineProvider>
  );
}
