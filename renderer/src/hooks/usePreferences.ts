import { useCallback, useSyncExternalStore } from 'react';
import { Get, ObjectKeyPaths } from '@/types';
import { storage, get, createStorage } from '@/utils/storage';
import { DefaultMantineColor } from '@mantine/core';

export interface ThemePreferences {
  darkMode: boolean;
  color: DefaultMantineColor;
}

export interface Preferences {
  theme: ThemePreferences;
}

export type PreferencesPaths = ObjectKeyPaths<Preferences>;

const initialValues: Preferences = {
  theme: { darkMode: true, color: 'blue' }
};

export const preferences = createStorage('preferences', initialValues);

export function usePreferences(): Preferences;
export function usePreferences<P extends PreferencesPaths>(path: P): Get<Preferences, P>;
export function usePreferences<P extends PreferencesPaths>(path?: P): Preferences | Get<Preferences, P> {
  const getSnapshot = useCallback(() => {
    const value = preferences.get() || initialValues;
    return path ? ((get(value, path) ?? get(initialValues, path)) as Get<Preferences, P>) : value;
  }, [path]);

  return useSyncExternalStore(storage.subscribe, getSnapshot);
}
