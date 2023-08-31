import { DefaultMantineColor, ColorSwatch, useMantineTheme, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronRight, IconPalette } from '@tabler/icons-react';
import { MenuModal, MenuModalRow, MenuModalSection } from '@/components/MenuModal';
import { preferences, usePreferences } from '@/hooks/usePreferences';

const colors: DefaultMantineColor[] = [
  'red',
  'pink',
  'grape',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'green',
  'yellow',
  'orange'
];

const chevron = <IconChevronRight size="1.2rem" />;
const colorIdx = 7;

export function ThemeSelection() {
  const theme = useMantineTheme();
  const color = usePreferences('theme.color');
  const [opened, { open, close }] = useDisclosure();

  return (
    <>
      <MenuModalRow
        title="Theme"
        icon={IconPalette}
        onClick={open}
        rightSection={
          <Group spacing={5}>
            {<ColorSwatch size={22} color={theme.colors[color][colorIdx]} />}
            {chevron}
          </Group>
        }
      />

      <MenuModal opened={opened} onClose={close} icon={IconPalette} title="Theme">
        <MenuModalSection>
          {colors.map(color => {
            return (
              <MenuModalRow
                key={color}
                title={
                  <Group>
                    <ColorSwatch size={22} color={theme.colors[color][colorIdx]} />
                    {color.toUpperCase()}
                  </Group>
                }
                rightSection={chevron}
                onClick={() => {
                  preferences.set('theme.color', color);
                  close();
                }}
              />
            );
          })}
        </MenuModalSection>
      </MenuModal>
    </>
  );
}
