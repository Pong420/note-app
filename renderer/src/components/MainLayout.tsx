import { Outlet } from 'react-router-dom';
import { createStyles } from '@mantine/core';
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
      // flex: `1 1 auto`,
      // display: 'flex',
      // flexDirection: 'column'
    }
  };
});

export function MainLayout() {
  const { classes } = useStyles({ appRegionSize: 'fixed' });

  return (
    <>
      <div className={classes.appRegion} />
      <div className={classes.content}>
        <Outlet />
      </div>
    </>
  );
}
