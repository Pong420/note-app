import { Group, Text } from '@mantine/core';

export interface PreferencesGroupProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PreferencesGroup({ title, description, children }: PreferencesGroupProps) {
  return (
    <Group wrap="nowrap" gap="lg">
      <div style={{ flex: '1 1 50%', alignSelf: 'flex-start' }}>
        <Text fw={500}>{title}</Text>
        {description && (
          <Text c="dimmed" size="sm">
            {description}
          </Text>
        )}
      </div>
      {children}
    </Group>
  );
}
