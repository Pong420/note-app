import { RouterProvider } from 'react-router-dom';
import { ColorScheme, MantineProvider, MantineThemeOverride } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalAnchor } from './components/ModalAnchor';
import { usePreferences } from './hooks/usePreferences';
import { router } from './routes';

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
  const darkMode = usePreferences('theme.darkMode');
  const colorScheme: ColorScheme = darkMode ? 'dark' : 'light';

  return (
    <MantineProvider withCSSVariables theme={{ colorScheme, components }}>
      <RouterProvider router={router} />
      <Notifications containerWidth={400} position="top-right" />
      <ModalAnchor />
    </MantineProvider>
  );
}
