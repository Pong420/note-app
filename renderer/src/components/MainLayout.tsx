import { Outlet } from 'react-router-dom';
import { Spotlight } from '@/components/Spotlight/Spotlight';
import cx from 'clsx';
import classes from './MainLayout.module.css';

export function MainLayout() {
  return (
    <>
      <div className={classes.appRegion} />
      <div className={cx(classes.content, '__stretch')}>
        <Outlet />
        <Spotlight />
      </div>
    </>
  );
}
