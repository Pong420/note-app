import { useCallback, useSyncExternalStore } from 'react';
import { Get, ObjectKeyPaths } from '@/types';
import { get, createLocalStorage } from '@/utils/storage';
import { DefaultMantineColor } from '@mantine/core';

export interface ThemePreferences {
  darkMode: boolean;
  primaryColor: DefaultMantineColor;
  pageWidth: number;
  fontSize: number;
}

export interface Preferences {
  theme: ThemePreferences;
}

export type PreferencesPaths = ObjectKeyPaths<Preferences>;

const initialValues: Preferences = {
  theme: { darkMode: true, primaryColor: 'blue', pageWidth: 960, fontSize: 16 }
};

export const preferences = createLocalStorage('preferences', initialValues);

export function usePreferences(): Preferences;
export function usePreferences<P extends PreferencesPaths>(path: P): Get<Preferences, P>;
export function usePreferences<P extends PreferencesPaths>(path?: P): Preferences | Get<Preferences, P> {
  const getSnapshot = useCallback(() => {
    const value = preferences.get() || initialValues;
    return path ? ((get(value, path) ?? get(initialValues, path)) as Get<Preferences, P>) : value;
  }, [path]);

  return useSyncExternalStore(preferences.subscribe, getSnapshot);
}
