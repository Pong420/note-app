import { Container, Group, Space, TextInput } from '@mantine/core';
import { BooleanOption, ColorSwatchs } from '@/components/Preferences/Options';
import { PreferencesGroup } from '@/components/Preferences/PreferencesGroup';
import { PreferencesStack } from '@/components/Preferences/PreferencesStack';
import { PreferencesSection } from '@/components/Preferences/PreferencesSection';
import { IconFolderOpen } from '@tabler/icons-react';
import { usePromise } from '@/hooks/usePromise';
import { NumberOption } from '@/components/Preferences/Options/NumberOption';
import { IconButton } from '@/components/IconButton';

export function PreferencePage() {
  const storageDir = usePromise(adapter.getAppPath);

  return (
    <Container>
      <h1>Preferences</h1>

      <Space h="lg" />

      <PreferencesSection title="Theme">
        <PreferencesGroup
          title="Dark Mode"
          description="Enable Dark Mode to switch the application's color scheme to a darker theme"
        >
          <BooleanOption path="theme.darkMode" />
        </PreferencesGroup>

        <PreferencesGroup title="Primary Color" description="Choose the main color used">
          <ColorSwatchs />
        </PreferencesGroup>

        <PreferencesGroup title="Content Width" description="The maximum page width of the content">
          <NumberOption path="theme.pageWidth" />
        </PreferencesGroup>

        <PreferencesGroup title="Font Size" description="The base font size of the application">
          <NumberOption path="theme.fontSize" />
        </PreferencesGroup>
      </PreferencesSection>

      <PreferencesSection title="Storage">
        <PreferencesStack title="App Data" description="Location where file content/assets is stored">
          <Group gap={5}>
            <TextInput readOnly style={{ flex: '1 1 auto' }} value={storageDir || ''} />
            <IconButton icon={IconFolderOpen} size={36} tooltip="Open Folder" onClick={() => adapter.openAppDir()} />
          </Group>
        </PreferencesStack>
      </PreferencesSection>
    </Container>
  );
}
