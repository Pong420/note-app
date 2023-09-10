import { Container, Group, Space } from '@mantine/core';
import { BooleanOption, ColorSwatchs } from '@/components/Preferences/Options';
import { PreferencesGroup } from '@/components/Preferences/PreferencesGroup';
import { PreferencesSection } from '@/components/Preferences/PreferencesSection';

export function PreferencePage() {
  return (
    <Container>
      <Group spacing={5}>
        <h1>Preferences</h1>
      </Group>

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
      </PreferencesSection>
    </Container>
  );
}
