import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ColorScheme, MantineProvider, MantineThemeOverride } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalAnchor } from './components/ModalAnchor';
import { usePreferences } from './hooks/usePreferences';
import { router } from './routes';
import { fileManager } from './utils/FileManager';

const components: MantineThemeOverride['components'] = {
  Card: {
    defaultProps(theme) {
      return {
        withBorder: theme.colorScheme === 'light',
        shadow: 'sm'
      };
    }
  }
};

export function App() {
  const primaryColor = usePreferences('theme.primaryColor');
  const darkMode = usePreferences('theme.darkMode');
  const colorScheme: ColorScheme = darkMode ? 'dark' : 'light';
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fileManager
      .load()
      .then(() => setReady(true))
      .catch(() => void 0);
  }, []);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      withCSSVariables
      theme={{ colorScheme, primaryColor, components }}
    >
      {ready && <RouterProvider router={router} />}
      <Notifications containerWidth={400} position="top-right" />
      <ModalAnchor />
    </MantineProvider>
  );
}
