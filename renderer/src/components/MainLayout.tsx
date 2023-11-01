import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Spotlight } from '@/components/Spotlight/Spotlight';
import cx from 'clsx';
import classes from './MainLayout.module.css';

export function MainLayout() {
  const location = useLocation();

  useEffect(() => {
    // reset scroll position when navigate between templates
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname, location.hash, location.search]);

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
