import { useSyncExternalStore } from 'react';
import { Navigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { fileManager } from '@/utils/FileManager';
import { generatePath } from '@/routes';

export function HomePage() {
  const { lastVisits } = useSyncExternalStore(fileManager.subscribe, fileManager.getSnapshot);
  const { title, id } = lastVisits.length ? lastVisits[0] : { title: 'Untitled', id: nanoid() };
  const pathname = generatePath('/editor/:title/:id', { title, id });
  return <Navigate to={pathname} />;
}
