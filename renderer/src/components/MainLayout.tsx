import { Outlet } from 'react-router-dom';
import { createStyles } from '@mantine/core';
import { SpotlightProvider } from '@/components/Spotlight/SpotlightProvider';
import { APP_REGION_HEIGHT } from '@/constants';

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
    }
  };
});

export function MainLayout() {
  const { classes } = useStyles({ appRegionSize: 'fixed' });

  return (
    <SpotlightProvider>
      <div className={classes.appRegion} />
      <div className={classes.content}>
        <Outlet />
      </div>
    </SpotlightProvider>
  );
}
