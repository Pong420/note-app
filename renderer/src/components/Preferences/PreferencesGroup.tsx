import { Group, Text } from '@mantine/core';

export interface PreferencesGroup {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PreferencesGroup({ title, description, children }: PreferencesGroup) {
  return (
    <Group wrap="nowrap" gap="lg">
      <div style={{ flex: '1 1 auto' }}>
        <Text fw={500}>{title}</Text>
        {description && (
          <Text color="dimmed" size="sm">
            {description}
          </Text>
        )}
      </div>
      {children}
    </Group>
  );
}
