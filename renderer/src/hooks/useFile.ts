import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { useParams } from 'react-router-dom';
import { fileManager } from '@/utils/FileManager';

/**
 * If `id` is not assigned return current file
 */
export function useFile({ id, subscription = true }: { id?: string; subscription?: boolean }) {
  const params = useParams() as { id: string };
  const hooks = subscription ? useSubscribeFile : useLoadFile;
  return hooks({ id: id || params.id });
}

function useLoadFile({ id }: { id: string }) {
  const [file, setFile] = useState(fileManager.getFile(id));

  useEffect(() => {
    adapter
      .getFile({ id })
      .then(setFile)
      .catch(() => void 0);
  }, [id]);

  return file;
}

function useSubscribeFile({ id }: { id: string }) {
  const getFile = useCallback(() => fileManager.getFile(id), [id]);
  return useSyncExternalStore(fileManager.subscribe, getFile);
}
