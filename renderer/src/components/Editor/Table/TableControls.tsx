import { Group } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { Commands, Editor } from '@tiptap/core';
import {
  IconColumnInsertLeft,
  IconColumnInsertRight,
  IconColumnRemove,
  IconRowInsertBottom,
  IconRowInsertTop,
  IconRowRemove,
  IconTableMinus,
  IconTableOptions,
  TablerIconsProps
} from '@tabler/icons-react';
import { TableOptionsModal } from './TableOptionsModal';

export type TableControlsProps = {
  editor: Editor;
  initialTableOptions?: Record<string, unknown>;
};

interface ButtonOptions {
  icon: React.ComponentType<TablerIconsProps>;
  title: string;
  command: keyof Commands['table'];
}

const options = [
  [
    {
      icon: IconRowInsertTop,
      title: 'Insert row above',
      command: 'addRowBefore'
    },
    {
      icon: IconRowInsertBottom,
      title: 'Insert row below',
      command: 'addRowAfter'
    },
    {
      icon: IconRowRemove,
      title: 'Delete row',
      command: 'deleteRow'
    }
  ],
  [
    {
      icon: IconColumnInsertLeft,
      title: 'Insert column to the left',
      command: 'addColumnBefore'
    },
    {
      icon: IconColumnInsertRight,
      title: 'Insert column to the right',
      command: 'addColumnAfter'
    },
    {
      icon: IconColumnRemove,
      title: 'Delete column',
      command: 'deleteColumn'
    }
  ],
  [
    {
      icon: IconTableMinus,
      title: 'Delete Table',
      command: 'deleteTable'
    }
  ]
] satisfies ButtonOptions[][];

const title = `Customise Table`;

export const TableControls = ({ editor, initialTableOptions }: TableControlsProps) => {
  return (
    <Group gap={10} wrap="nowrap">
      {options.map((group, i) => {
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
      })}

      <RichTextEditor.Control title={title} aria-label={title}>
        <IconTableOptions
          stroke={1.5}
          size="1rem"
          onClick={() => {
            TableOptionsModal.open({
              initialValues: initialTableOptions,
              onConfirm: attributes => {
                editor.commands.updateAttributes('table', attributes);
              }
            });
          }}
        />
      </RichTextEditor.Control>
    </Group>
  );
};
