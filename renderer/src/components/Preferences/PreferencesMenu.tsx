import { Button, Group } from '@mantine/core';
import { IconChevronRight, IconDatabase, IconMenu2, IconMoon } from '@tabler/icons-react';
import { MenuModal, type MenuModalProps, MenuModalRow, MenuModalSection } from '@/components/MenuModal';
import { createModalHandler } from '@/utils/modals';
import { preferences } from '@/hooks/usePreferences';
import { BooleanOption } from './Options';
import { ThemeSelection } from './ThemeSelection';

const [openMenu, closeMenu] = createModalHandler(PreferencesMenu);
const Icon = IconMenu2;

export function PreferencesMenu(props: MenuModalProps) {
  return (
    <MenuModal icon={Icon} title="Preferences" {...props}>
      <MenuModalSection>
        <MenuModalRow title="Dark Mode" icon={IconMoon} rightSection={<BooleanOption path="theme.darkMode" />} />
        <ThemeSelection />
        <MenuModalRow
          title="Storage"
          icon={IconDatabase}
          rightSection={
            <Group spacing={0}>
              <IconChevronRight size="1.2rem" />
            </Group>
          }
          onClick={() => void adapter.openTemplateRootDir()}
        />
      </MenuModalSection>

      <MenuModalSection>
        <MenuModalRow title="Version" text={VERSION} />
      </MenuModalSection>

      <Button color="red" mx="md" mt="md" mb={0} onClick={() => preferences.reset()}>
        Reset To Default
      </Button>
    </MenuModal>
  );
}

PreferencesMenu.open = openMenu;
PreferencesMenu.close = closeMenu;
PreferencesMenu.Icon = Icon;
