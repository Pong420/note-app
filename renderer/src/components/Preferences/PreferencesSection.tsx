import { Box, Divider, Group, Text, Stack } from '@mantine/core';

export interface PreferencesSectionProps {
  title: string;
  children?: React.ReactNode;
}

export function PreferencesSection({ title, children }: PreferencesSectionProps) {
  return (
    <Box w="100%">
      <Group align="self-start" noWrap spacing="lg">
        <Text weight={500} style={{ flexBasis: '30%' }}>
          {title}
        </Text>
        <Stack spacing={50} style={{ flexBasis: '70%' }}>
          {children}
        </Stack>
      </Group>

      <Divider my={40} />
    </Box>
  );
}
