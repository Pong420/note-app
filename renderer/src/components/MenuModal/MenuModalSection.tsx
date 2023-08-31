import { Box, Group, Stack, Text } from '@mantine/core';
import { TablerIconsProps } from '@tabler/icons-react';

export interface MenuModalSectionProps {
  title?: React.ReactNode;
  icon?: React.ComponentType<TablerIconsProps>;
  children?: React.ReactNode;
}

export function MenuModalSection({ title, icon: Icon, children }: MenuModalSectionProps) {
  const titleNode = (
    <Text weight={500} sx={!title ? { visibility: 'hidden', height: '0.5em' } : { lineHeight: '2.75rem' }}>
      {title}
    </Text>
  );

  return (
    <Stack spacing={2}>
      <Box px="md">
        {Icon ? (
          <Group spacing={5}>
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
