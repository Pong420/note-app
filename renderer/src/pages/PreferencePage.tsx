import { ActionIcon, Container, Group, Space, TextInput } from '@mantine/core';
import { BooleanOption, ColorSwatchs } from '@/components/Preferences/Options';
import { PreferencesGroup } from '@/components/Preferences/PreferencesGroup';
import { PreferencesStack } from '@/components/Preferences/PreferencesStack';
import { PreferencesSection } from '@/components/Preferences/PreferencesSection';
import { IconExternalLink } from '@tabler/icons-react';
import { usePromise } from '@/hooks/usePromise';
import { NumberOption } from '@/components/Preferences/Options/NumberOption';

export function PreferencePage() {
  const appPath = usePromise(adapter.getAppPath);

  return (
    <Container>
      <h3>Preferences</h3>

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
            <TextInput readOnly style={{ flex: '1 1 auto' }} value={appPath || ''} />
            <ActionIcon variant="default" size="lg" onClick={() => adapter.openAppDir()}>
              <IconExternalLink size="1rem" />
            </ActionIcon>
          </Group>
        </PreferencesStack>
      </PreferencesSection>
    </Container>
  );
}
