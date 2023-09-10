import { RouterProvider } from 'react-router-dom';
import { ColorScheme, MantineProvider, MantineThemeOverride } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalAnchor } from './components/ModalAnchor';
import { usePromise } from './hooks/usePromise';
import { usePreferences } from './hooks/usePreferences';
import { router } from './routes';
import { fileManager } from './utils/FileManager';

const init = () => fileManager.load();

export function App() {
  const theme = usePreferences('theme');
  const colorScheme: ColorScheme = theme.darkMode ? 'dark' : 'light';
  const ready = usePromise(init);

  const components: MantineThemeOverride['components'] = {
    Card: {
      defaultProps(theme) {
        return {
          withBorder: theme.colorScheme === 'light',
          shadow: 'sm'
        };
      }
    },
    Container: {
      defaultProps() {
        return {
          maw: theme.pageWidth
        };
      }
    }
  };

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      withCSSVariables
      theme={{
        colorScheme,
        primaryColor: theme.primaryColor,
        components,
        globalStyles() {
          return {
            body: {
              fontSize: theme.fontSize
            }
          };
        }
      }}
    >
      {ready && <RouterProvider router={router} />}
      <Notifications containerWidth={400} position="top-right" />
      <ModalAnchor />
    </MantineProvider>
  );
}
