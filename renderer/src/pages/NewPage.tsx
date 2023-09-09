import { Navigate, useParams } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { generatePath } from '@/routes';

export function NewPage() {
  const params = useParams() as { title?: string };
  const title = params.title || 'Untitled';
  return <Navigate to={generatePath('/editor/:title/:id', { title, id: nanoid() })} />;
}
