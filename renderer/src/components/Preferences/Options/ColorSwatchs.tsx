import { preferences, usePreferences } from '@/hooks/usePreferences';
import { ColorSwatch, Group, DefaultMantineColor, CheckIcon, rem } from '@mantine/core';

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
  const primaryColor = usePreferences('theme.primaryColor');

  return (
    <Group justify="center" wrap="wrap" gap={spacing} w={`${(size + spacing) * 6 - spacing}px`}>
      {colors.map(color => (
        <ColorSwatch
          key={color}
          size={size}
          component="button"
          color={`var(--mantine-color-${color}-6)`}
          style={{ color: '#fff', cursor: 'pointer' }}
          onClick={() => preferences.set('theme.primaryColor', color)}
        >
          {color === primaryColor && <CheckIcon style={{ width: rem(10), height: rem(10), marginTop: '0.05rem' }} />}
        </ColorSwatch>
      ))}
    </Group>
  );
}
