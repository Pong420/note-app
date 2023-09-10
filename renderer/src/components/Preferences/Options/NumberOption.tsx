import { Get, ValueOf } from '@/types';
import { NumberInput, NumberInputProps } from '@mantine/core';
import { usePreferences, Preferences, PreferencesPaths, preferences } from '@/hooks/usePreferences';

type Path = ValueOf<{ [K in PreferencesPaths]: Get<Preferences, K> extends number ? K : never }>;

export interface NumberOptionProps extends NumberInputProps {
  path: Path;
}

export function NumberOption({ path, ...props }: NumberOptionProps) {
  const value = usePreferences(path);
  return (
    <NumberInput
      {...props}
      value={value}
      onChange={value => typeof value === 'number' && preferences.set(path, value)}
    />
  );
}
