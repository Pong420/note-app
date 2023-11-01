import { Box, Divider, Group, Text, Stack } from '@mantine/core';

export interface PreferencesSectionProps {
  title: string;
  children?: React.ReactNode;
}

export function PreferencesSection({ title, children }: PreferencesSectionProps) {
  return (
    <Box w="100%">
      <Group align="self-start" wrap="nowrap" gap="lg">
        <Text fw="bold" size="lg" style={{ flexBasis: '25%', lineHeight: '24.8px' }}>
          {title}
        </Text>

        <Stack gap={50} style={{ flexBasis: '75%' }}>
          {children}
        </Stack>
      </Group>

      <Divider my={40} />
    </Box>
  );
}
