import { Space, Text } from '@mantine/core';

export interface PreferencesStack {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PreferencesStack({ title, description, children }: PreferencesStack) {
  return (
    <div>
      <Text weight={500}>{title}</Text>

      {description && (
        <Text color="dimmed" size="sm">
          {description}
        </Text>
      )}

      <Space h={5} />

      {children}
    </div>
  );
}
