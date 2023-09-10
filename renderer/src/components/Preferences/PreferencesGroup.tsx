import { Group, Text } from '@mantine/core';

export interface PreferencesGroup {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PreferencesGroup({ title, description, children }: PreferencesGroup) {
  return (
    <Group noWrap spacing="lg">
      <div style={{ flex: '1 1 auto' }}>
        <Text weight={500}>{title}</Text>
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
