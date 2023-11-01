import { useCallback, useSyncExternalStore } from 'react';
import { DefaultMantineColor } from '@mantine/core';
import { Get, ObjectKeyPaths } from '@/types';
import { get, createLocalStorage } from '@/utils/storage';
import { editorColors } from '@/constants';
import type { TextBubbleMenuOption } from '@/constants';

export interface ThemePreferences {
  darkMode: boolean;
  primaryColor: DefaultMantineColor;
}

export interface EditorPreferences {
  pageWidth: number;
  fontSize: number;
  colors: string[];
  textBubbleMenu: {
    controls: TextBubbleMenuOption[];
  };
}

export interface Preferences {
  theme: ThemePreferences;
  editor: EditorPreferences;
}

export type PreferencesPaths = ObjectKeyPaths<Preferences>;

export const initialPreferences: Preferences = {
  theme: { darkMode: true, primaryColor: 'blue' },

  editor: {
    pageWidth: 960,
    fontSize: 16,
    colors: [...editorColors],
    textBubbleMenu: {
      controls: [
        'Bold',
        'Strikethrough',
        'Code',
        'ColorPicker',
        'Highlight',
        'ClearFormatting',
        'AlignCenter',
        'AlignJustify',
        'AlignLeft',
        'AlignRight',
        'H1',
        'H2',
        'H3',
        'H4'
      ]
    }
  }
};

export const preferences = createLocalStorage('preferences', initialPreferences);

export function usePreferences(): Preferences;
export function usePreferences<P extends PreferencesPaths>(path: P): Get<Preferences, P>;
export function usePreferences<P extends PreferencesPaths>(path?: P): Preferences | Get<Preferences, P> {
  const getSnapshot = useCallback(() => {
    const value = preferences.get() || initialPreferences;
    return path ? ((get(value, path) ?? get(initialPreferences, path)) as Get<Preferences, P>) : value;
  }, [path]);

  return useSyncExternalStore(preferences.subscribe, getSnapshot);
}
