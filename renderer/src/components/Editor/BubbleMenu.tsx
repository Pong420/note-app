import { Editor } from '@tiptap/core';
import { BubbleMenu as TiptapBubbleMenu } from '@tiptap/react';
import { Group, Paper } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';

export type BubbleMenuProps = {
  editor: Editor;
};

export function BubbleMenu({ editor }: BubbleMenuProps) {
  return (
    <TiptapBubbleMenu editor={editor}>
      <Paper p={5} shadow="md" withBorder>
        <Group gap={10}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Highlight />
            <RichTextEditor.ColorPicker
              colors={[
                '#25262b',
                '#868e96',
                '#fa5252',
                '#e64980',
                '#be4bdb',
                '#7950f2',
                '#4c6ef5',
                '#228be6',
                '#15aabf',
                '#12b886',
                '#40c057',
                '#82c91e',
                '#fab005',
                '#fd7e14'
              ]}
            />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.ClearFormatting />
          </RichTextEditor.ControlsGroup>

          {/* {options.map((group, i) => {
          return (
            <RichTextEditor.ControlsGroup key={i}>
              {group.map(({ icon: Icon, title, command }) => (
                <RichTextEditor.Control
                  key={title}
                  title={title}
                  aria-label={title}
                  disabled={!editor.can()[command]()}
                  onClick={() => editor.chain().focus()[command]().run()}
                >
                  <Icon stroke={1.5} size="1rem" />
                </RichTextEditor.Control>
              ))}
            </RichTextEditor.ControlsGroup>
          );
        })} */}
        </Group>
      </Paper>
    </TiptapBubbleMenu>
  );
}
