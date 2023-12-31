import { Space, Text } from '@mantine/core';

export interface PreferencesStackProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PreferencesStack({ title, description, children }: PreferencesStackProps) {
  return (
    <div>
      <Text fw={500}>{title}</Text>

      {description && (
        <Text c="dimmed" size="sm">
          {description}
        </Text>
      )}

      <Space h={5} />

      {children}
    </div>
  );
}
