import { Outlet } from 'react-router-dom';
import { TitleBar } from './TitleBar';

export function RootLayout() {
  return (
    <>
      <TitleBar />
      <Outlet />
    </>
  );
}
