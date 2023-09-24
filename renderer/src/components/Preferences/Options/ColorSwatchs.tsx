import { preferences, usePreferences } from '@/hooks/usePreferences';
import { ColorSwatch, Group, useMantineTheme, DefaultMantineColor, CheckIcon, rem } from '@mantine/core';

const colors: DefaultMantineColor[] = [
  // 'dark',
  // 'gray',
  'red',
  'pink',
  'grape',
  'violet',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'green',
  'lime',
  'yellow',
  'orange'
];

const size = 20;
const spacing = 10;

export function ColorSwatchs() {
  const theme = useMantineTheme();
  const primaryColor = usePreferences('theme.primaryColor');

  return (
    <Group justify="center" gap={spacing} w={(size + spacing) * 6 - spacing}>
      {colors.map(color => (
        <ColorSwatch
          key={color}
          size={size}
          component="button"
          color={theme.colors[color][6]}
          style={{ color: '#fff', cursor: 'pointer' }}
          onClick={() => preferences.set('theme.primaryColor', color)}
        >
          {color === primaryColor && <CheckIcon width={rem(10)} style={{ marginTop: '0.05rem' }} />}
        </ColorSwatch>
      ))}
    </Group>
  );
}
