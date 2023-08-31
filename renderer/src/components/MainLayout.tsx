import { Outlet } from 'react-router-dom';
import { AppShell, ColorScheme, Header, MantineProvider, MantineThemeOverride } from '@mantine/core';
import { usePreferences } from '@/hooks/usePreferences';
import { TITLE_BAR_HEIGHT } from '@/constants';

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

export function MainLayout() {
  const darkMode = usePreferences('theme.darkMode');
  const primaryColor = usePreferences('theme.color');
  const colorScheme: ColorScheme = darkMode ? 'dark' : 'light';

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      withCSSVariables
      theme={{ colorScheme, primaryColor, components }}
    >
      <AppShell
        padding="lg"
        header={
          <Header fixed height={TITLE_BAR_HEIGHT}>
            {/*  */}
          </Header>
        }
        styles={{
          main: {
            paddingTop: `var(--mantine-header-height, 0px)`
          }
        }}
      >
        <Outlet />
      </AppShell>
    </MantineProvider>
  );
}
