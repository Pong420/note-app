import { Group, TextInput } from '@mantine/core';
import { IconFolderOpen } from '@tabler/icons-react';
import { PreferencesStack } from '@/components/Preferences/PreferencesStack';
import { IconButton } from '@/components/IconButton';

export function DirectoryOption({ dir = '', title = '', description = '' }) {
  return (
    <PreferencesStack title={title} description={description}>
      <Group gap={5}>
        <TextInput readOnly style={{ flex: '1 1 auto' }} value={dir || ''} />
        <IconButton icon={IconFolderOpen} size={36} title="Open Directory" onClick={() => void adapter.openPath(dir)} />
      </Group>
    </PreferencesStack>
  );
}
