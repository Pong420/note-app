import { useEffect, useState } from 'react';
import { Group, Paper, Portal } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { Commands, Editor, findParentNodeClosestToPos } from '@tiptap/core';
import {
  IconColumnInsertLeft,
  IconColumnInsertRight,
  IconColumnRemove,
  IconRowInsertBottom,
  IconRowInsertTop,
  IconRowRemove,
  IconTableColumn,
  IconTableMinus,
  IconTableRow,
  TablerIconsProps
} from '@tabler/icons-react';

export type TableBubbleMenuProps = {
  editor: Editor;
};

interface ButtonOptions {
  icon: React.ComponentType<TablerIconsProps>;
  title: string;
  command: keyof Commands['table'];
}

const options = [
  [
    {
      icon: IconTableMinus,
      title: 'Delete Table',
      command: 'deleteTable'
    }
  ],
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
      icon: IconTableRow,
      title: 'Toggle Header Row',
      command: 'toggleHeaderRow'
    },
    {
      icon: IconTableColumn,
      title: 'Toggle Header Column',
      command: 'toggleHeaderColumn'
    }
  ]
] satisfies ButtonOptions[][];

export const tableMenuRefId = `table-menu-item`;

function getPos(node: Element | null) {
  let top = 0;
  let left = 0;
  const height = node && node instanceof HTMLElement ? node.offsetHeight : 0;

  while (node && node instanceof HTMLElement && !node.querySelector(`#${tableMenuRefId}`)) {
    top += node.offsetTop;
    left += node.offsetLeft;
    node = node.offsetParent;
  }

  return { top: top + height, left };
}

// References:
// https://github.com/sjdemartini/mui-tiptap/blob/main/src/TableBubbleMenu.tsx
// https://github.com/ueberdosis/tiptap/blob/main/packages/react/src/BubbleMenu.tsx
// https://github.com/ueberdosis/tiptap/blob/main/packages/extension-bubble-menu/src/bubble-menu-plugin.ts
export const TableBubbleMenu = ({ editor }: TableBubbleMenuProps) => {
  const [rect, setRect] = useState<{ top: number; left: number }>();
  const isDestroyed = editor.isDestroyed;

  useEffect(() => {
    const getTableNode = () => {
      const nearestTableParent = editor.isActive('table')
        ? findParentNodeClosestToPos(editor.state.selection.$anchor, node => node.type.name === 'table')
        : null;

      if (nearestTableParent) {
        const wrapperDomNode = editor.view.nodeDOM(nearestTableParent.pos) as HTMLElement | null | undefined;
        const tableDomNode = wrapperDomNode?.querySelector('table') || wrapperDomNode;
        return tableDomNode ? getPos(tableDomNode) : undefined;
      }
    };

    const onUpdate = () => {
      const rect = getTableNode();
      setRect(rect);
    };

    editor.on('selectionUpdate', onUpdate);
    return () => {
      editor.off('selectionUpdate', onUpdate);
    };
  }, [editor, isDestroyed]);

  if (!rect) return null;

  return (
    <Portal target={document.querySelector<HTMLElement>(`#${tableMenuRefId}`) || undefined}>
      <Paper
        p={5}
        shadow="md"
        withBorder
        style={{ position: 'absolute', top: rect.top + 5, right: rect.left, zIndex: 1 }}
      >
        <Group gap={10}>
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
        </Group>
      </Paper>
    </Portal>
  );
};
