import { Outlet } from 'react-router-dom';
import { ColorScheme, MantineProvider, MantineThemeOverride, createStyles } from '@mantine/core';
import { usePreferences } from '@/hooks/usePreferences';
import { APP_REGION_HEIGHT } from '@/constants';

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

const useStyles = createStyles((_theme, { appRegionSize }: { appRegionSize: 'fixed' | 'fullpage' }) => {
  return {
    appRegion: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: `100%`,
      height: appRegionSize === 'fullpage' ? `100%` : APP_REGION_HEIGHT,
      appRegion: 'drag'
    },
    content: {
      position: 'relative'
      // flex: `1 1 auto`,
      // display: 'flex',
      // flexDirection: 'column'
    }
  };
});

export function MainLayout() {
  const darkMode = usePreferences('theme.darkMode');
  const primaryColor = usePreferences('theme.color');
  const colorScheme: ColorScheme = darkMode ? 'dark' : 'light';
  const { classes } = useStyles({ appRegionSize: 'fixed' });

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      withCSSVariables
      theme={{ colorScheme, primaryColor, components }}
    >
      <div className={classes.appRegion} />
      <div className={classes.content}>
        <Outlet />
      </div>
    </MantineProvider>
  );
}
