import { useSyncExternalStore } from 'react';
import { Navigate } from 'react-router-dom';
import { fileManager } from '@/utils/FileManager';
import { generatePath } from '@/routes';

export function HomePage() {
  const { lastVisits } = useSyncExternalStore(fileManager.subscribe, fileManager.getSnapshot);
  const pathname = lastVisits.length
    ? generatePath('/editor/:title/:id', lastVisits[0])
    : generatePath('/editor/new-page');
  return <Navigate to={pathname} />;
}
