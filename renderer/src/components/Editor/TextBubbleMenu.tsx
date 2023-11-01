/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Group, Paper } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { BubbleMenuView } from '@tiptap/extension-bubble-menu';
import { Editor, isTextSelection } from '@tiptap/core';
import { BubbleMenu, BubbleMenuProps } from '@tiptap/react';
import { usePreferences } from '@/hooks/usePreferences';
import { textBubbleMenuOptions } from '@/constants';

export interface TextBubbleMenuProps {
  editor: Editor;
}

const tippyOptions = { maxWidth: 'none', zIndex: 11 };

export function TextBubbleMenu({ editor }: TextBubbleMenuProps) {
  const colors = usePreferences('editor.colors');
  const controls = usePreferences('editor.textBubbleMenu.controls');

  const showControls = !!controls.length;

  const shouldShow: BubbleMenuProps['shouldShow'] = function (this: unknown, options) {
    const { state, from, to } = options;
    const { doc, selection } = state;

    // ture if selection is lokalise node but do not have other controls configured
    // so return fasle and do not show the menu
    if (!showControls) return false;

    const defaultShow = BubbleMenuView.prototype.shouldShow?.call(this, options);

    const textSelection = isTextSelection(selection);
    const isEmptyTextBlock = !doc.textBetween(from, to).length;

    return !!defaultShow || (textSelection && !isEmptyTextBlock);
  };

  return (
    <BubbleMenu editor={editor} updateDelay={500} tippyOptions={tippyOptions} shouldShow={shouldShow}>
      <Paper p={5} shadow="md" withBorder w="100%">
        <Group gap={10} wrap="nowrap">
          {showControls && (
            <>
              {textBubbleMenuOptions.map((group, i) => {
                const _controls = group.filter(c => controls.includes(c));
                return _controls.length ? (
                  <RichTextEditor.ControlsGroup key={i}>
                    {_controls.map(key => {
                      if (key === 'ColorPicker') {
                        return <RichTextEditor.ColorPicker key={key} colors={colors} />;
                      }
                      const Component = RichTextEditor[key];
                      return <Component key={key} />;
                    })}
                  </RichTextEditor.ControlsGroup>
                ) : null;
              })}
            </>
          )}
        </Group>
      </Paper>
    </BubbleMenu>
  );
}
