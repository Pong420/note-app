import { TagsInput } from '@mantine/core';
import { PreferencesStack } from '@/components/Preferences/PreferencesStack';
import { preferences, usePreferences } from '@/hooks/usePreferences';
import { textBubbleMenuOptions, TextBubbleMenuOption as ITextBubbleMenuOption } from '@/constants';

const textBubbleMenuOptionsData = textBubbleMenuOptions.flat().map(label => ({ label, value: label }));

export function TextBubbleMenuOption() {
  const controls = usePreferences('editor.textBubbleMenu.controls');
  return (
    <PreferencesStack
      title="Text Highlight Menu Options"
      description="Customize the available menu options that appear when text is highlighted"
    >
      <TagsInput
        clearable
        data={textBubbleMenuOptionsData}
        defaultValue={controls}
        onChange={tags => preferences.set('editor.textBubbleMenu.controls', tags as ITextBubbleMenuOption[])}
      />
    </PreferencesStack>
  );
}
