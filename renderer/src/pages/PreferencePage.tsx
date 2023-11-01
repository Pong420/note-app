import { Container, Group, Space, Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { BooleanOption } from '@/components/Preferences/Options';
import { PreferencesGroup } from '@/components/Preferences/PreferencesGroup';
import { PreferencesSection } from '@/components/Preferences/PreferencesSection';
import { PrimaryColorSwatch } from '@/components/Preferences/Options/PrimaryColorSwatch';
import { EditorTextColorOption } from '@/components/Preferences/Options/EditorTextColorOption';
import { DirectoryOption } from '@/components/Preferences/Options/DirectoryOption';
import { TextBubbleMenuOption } from '@/components/Preferences/Options/TextBubbleMenuOption';
import { usePromise } from '@/hooks/usePromise';
import { NumberOption } from '@/components/Preferences/Options/NumberOption';
import { IconButton } from '@/components/IconButton';
import { navigate } from '@/routes';

export function PreferencePage() {
  const storageDir = usePromise(adapter.getStorageDir);

  // TODO:
  // esc button go back

  return (
    <Container>
      <Group justify="space-between">
        <h1>Preferences</h1>
        <IconButton icon={IconX} title="Go Back" variant="transparent" onClick={() => navigate(-1)} />
      </Group>

      <Space h="lg" />

      <PreferencesSection title="Editor">
        <PreferencesGroup title="Version">
          <Text c="dimmed">{VERSION}</Text>
        </PreferencesGroup>

        <PreferencesGroup
          title="Dark Mode"
          description="Enable Dark Mode to switch the application's color scheme to a darker theme"
        >
          <BooleanOption path="theme.darkMode" />
        </PreferencesGroup>

        <PreferencesGroup title="Primary Color" description="Choose the main color used">
          <PrimaryColorSwatch />
        </PreferencesGroup>

        <PreferencesGroup title="Content Width" description="The maximum page width of the content">
          <NumberOption path="editor.pageWidth" />
        </PreferencesGroup>

        <PreferencesGroup title="Font Size" description="The base font size of the application">
          <NumberOption path="editor.fontSize" />
        </PreferencesGroup>

        <EditorTextColorOption />

        <TextBubbleMenuOption />
      </PreferencesSection>

      <PreferencesSection title="Storage">
        <DirectoryOption title="Storage Directory" description="Location of root storage directory" dir={storageDir} />
      </PreferencesSection>
    </Container>
  );
}
