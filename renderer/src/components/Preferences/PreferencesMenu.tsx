import { Button } from '@mantine/core';
import { IconMenu2, IconMoon } from '@tabler/icons-react';
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
