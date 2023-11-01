import { Group } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/core';
import {
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
  IconTableFilled,
  IconTableOptions,
  TablerIconsProps
} from '@tabler/icons-react';
import { CellSelection } from '@tiptap/pm/tables';
import { TableCellOptionsModal } from './TableCellOptionsModal';

export type TableCellControlsProps = {
  editor: Editor;
};

interface ButtonOptions {
  icon: React.ComponentType<TablerIconsProps>;
  title: string;
  action?: ({ editor }: { editor: Editor }) => void;
  attribute: [string, unknown];
}

const options: ButtonOptions[][] = [
  [
    {
      icon: IconAlignLeft,
      title: 'Align Left',
      attribute: ['align', 'left']
    },
    {
      icon: IconAlignCenter,
      title: 'Align Center',
      attribute: ['align', 'center']
    },
    {
      icon: IconAlignRight,
      title: 'Align Right',
      attribute: ['align', 'right']
    }
  ],
  [
    {
      icon: IconTableFilled,
      title: 'Fill Background Color',
      attribute: ['bgcolor', '#404040']
    }
  ]
];

const title = `Customise Tabel Cell`;

const hasAttribute = (editor: Editor, key: string, value: unknown) => {
  const selection = editor.state.selection;
  if (!(selection instanceof CellSelection)) return false;

  let found = false;
  selection.forEachCell(node => {
    found = node.attrs[key] === value;
  });
  return found;
};

export const TableCellControls = ({ editor }: TableCellControlsProps) => {
  return (
    <Group gap={10} wrap="nowrap">
      {options.map((group, i) => {
        return (
          <RichTextEditor.ControlsGroup key={i}>
            {group.map(({ icon: Icon, title, attribute }) => {
              const active = hasAttribute(editor, ...attribute);
              return (
                <RichTextEditor.Control
                  key={title}
                  title={title}
                  aria-label={title}
                  active={active}
                  onClick={() => {
                    editor.commands.setCellAttribute(attribute[0], active ? null : attribute[1]);
                  }}
                >
                  <Icon stroke={1.5} size="1rem" />
                </RichTextEditor.Control>
              );
            })}
          </RichTextEditor.ControlsGroup>
        );
      })}

      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Control title={title} aria-label={title}>
          <IconTableOptions
            stroke={1.5}
            size="1rem"
            onClick={() => {
              const selection = editor.state.selection;
              if (!(selection instanceof CellSelection)) return;

              let initialValues = {};

              selection.forEachCell(node => {
                initialValues = { ...node.attrs, ...initialValues };
              });

              TableCellOptionsModal.open({
                initialValues,
                onConfirm: attributes => {
                  for (const k in attributes) {
                    editor.commands.setCellAttribute(k, attributes[k]);
                  }
                }
              });
            }}
          />
        </RichTextEditor.Control>
      </RichTextEditor.ControlsGroup>
    </Group>
  );
};
