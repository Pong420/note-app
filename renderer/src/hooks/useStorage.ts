/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useSyncExternalStore } from 'react';
import { Get, ObjectKeyPaths } from '@/types';
import { IStorage, get } from '@/utils/storage';

export function useStorage<T extends Record<string, any>>(storage: IStorage<T>): T;
export function useStorage<T extends Record<string, any>, P extends ObjectKeyPaths<T>>(
  storage: IStorage<T>,
  path: P
): Get<T, P>;
export function useStorage<T extends Record<string, any>, P extends ObjectKeyPaths<T>>(
  storage: IStorage<T>,
  path?: P
): T | Get<T, P> {
  const getSnapshot = useCallback(() => {
    const value = storage.get();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return path ? (get(value, path) as Get<T, P>) : value;
  }, [path, storage]);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return useSyncExternalStore(storage.subscribe, getSnapshot);
}
