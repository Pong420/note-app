import { Switch } from '@mantine/core';
import { usePreferences, Preferences, PreferencesPaths, preferences } from '@/hooks/usePreferences';
import { Get, ValueOf } from '@/types';

type Path = ValueOf<{ [K in PreferencesPaths]: Get<Preferences, K> extends boolean ? K : never }>;

export interface BooleanOptionProps {
  path: Path;
}

export function BooleanOption({ path }: BooleanOptionProps) {
  const value = usePreferences(path);
  const primaryColor = usePreferences('theme.color');
  return (
    <Switch
      size="md"
      color={primaryColor}
      checked={value}
      onChange={event => preferences.set(path, event.currentTarget.checked)}
    />
  );
}
