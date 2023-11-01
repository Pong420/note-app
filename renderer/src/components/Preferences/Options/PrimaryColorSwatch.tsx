import { CheckIcon, rem } from '@mantine/core';
import { ColorSwatchs } from '@/components/Preferences/Options';
import { preferences, usePreferences } from '@/hooks/usePreferences';
import { themeColors } from '@/constants';

export function PrimaryColorSwatch() {
  const primaryColor = usePreferences('theme.primaryColor');

  return (
    <ColorSwatchs
      colors={themeColors}
      getColor={color => `var(--mantine-color-${color}-6)`}
      onClick={color => preferences.set('theme.primaryColor', color)}
    >
      {color =>
        color === primaryColor && <CheckIcon style={{ width: rem(10), height: rem(10), marginTop: '0.05rem' }} />
      }
    </ColorSwatchs>
  );
}
