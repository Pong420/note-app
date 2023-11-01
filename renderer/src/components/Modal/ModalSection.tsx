import { Box, Group, Stack, Text } from '@mantine/core';
import { TablerIconsProps } from '@tabler/icons-react';

export interface ModalSectionProps {
  title?: React.ReactNode;
  icon?: React.ComponentType<TablerIconsProps>;
  children?: React.ReactNode;
}

export function ModalSection({ title, icon: Icon, children }: ModalSectionProps) {
  const titleNode = (
    <Text fw={500} style={!title ? { visibility: 'hidden', height: '0.5em' } : { lineHeight: '2.75rem' }}>
      {title}
    </Text>
  );

  return (
    <Stack gap={2}>
      <Box px="md">
        {Icon ? (
          <Group gap={5}>
            <Icon size="1.3rem" /> {titleNode}
          </Group>
        ) : (
          titleNode
        )}
      </Box>
      {children}
    </Stack>
  );
}
