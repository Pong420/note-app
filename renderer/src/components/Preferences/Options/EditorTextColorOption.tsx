import { Button, CloseIcon, ColorInput, Group, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPlus } from '@tabler/icons-react';
import { ColorSwatchs } from '@/components/Preferences/Options';
import { PreferencesGroup } from '@/components/Preferences/PreferencesGroup';
import { IconButton } from '@/components/IconButton';
import { initialPreferences, preferences, usePreferences } from '@/hooks/usePreferences';
import classes from './EditorColorSwatch.module.css';

export function EditorTextColorOption() {
  const colors = usePreferences('editor.colors');
  const form = useForm({ initialValues: { color: '' } });
  const handleSubmit = form.onSubmit(({ color }) => {
    preferences.set('editor.colors', Array.from(new Set([...colors, color])));
    form.reset();
  });

  return (
    <Stack>
      <PreferencesGroup
        title="Text Colors"
        description="Customize the available text colors by submitting a color code double clicking on a color to delete it"
      >
        <Stack gap={10}>
          <ColorSwatchs
            className={classes.color}
            colors={colors}
            onDoubleClick={color =>
              preferences.set(
                'editor.colors',
                colors.filter(c => c !== color)
              )
            }
          >
            {() => <CloseIcon style={{ display: 'block' }} />}
          </ColorSwatchs>

          <Button
            size="compact-xs"
            variant="outline"
            onClick={() => preferences.set('editor.colors', initialPreferences.editor.colors)}
          >
            Reset Default Colors
          </Button>
        </Stack>
      </PreferencesGroup>

      <form onSubmit={handleSubmit}>
        <Group gap="xs">
          <ColorInput
            size="xs"
            withPicker={false}
            withEyeDropper={false}
            style={{ flex: '1 0 auto' }}
            {...form.getInputProps('color')}
          />
          <IconButton active title="Add" icon={IconPlus}></IconButton>
        </Group>
      </form>
    </Stack>
  );
}
