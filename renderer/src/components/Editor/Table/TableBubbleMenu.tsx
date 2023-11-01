import { useEffect, useState } from 'react';
import { Paper, Portal } from '@mantine/core';
import { Editor, findParentNodeClosestToPos } from '@tiptap/core';
import { TableControls } from './TableControls';
import { TableCellControls } from './TableCellControls';

export type TableBubbleMenuProps = {
  editor: Editor;
};

interface State {
  table?: ReturnType<typeof findParentNodeClosestToPos>;
  rect?: { top: number; left: number };
  cellSelected: boolean;
}

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
  const [{ table, rect, cellSelected }, setState] = useState<State>({
    cellSelected: false
  });

  useEffect(() => {
    const getTableNode = ({ editor }: { editor: Editor }) => {
      const nearestTableParent = editor.isActive('table')
        ? findParentNodeClosestToPos(editor.state.selection.$anchor, node => node.type.name === 'table')
        : null;

      if (nearestTableParent) {
        const wrapperDomNode = editor.view.nodeDOM(nearestTableParent.pos) as HTMLElement | null | undefined;
        const tableDomNode = wrapperDomNode?.querySelector('table') || wrapperDomNode;
        return { rect: tableDomNode ? getPos(tableDomNode) : undefined, table: nearestTableParent };
      }
    };

    const onUpdate = ({ editor }: { editor: Editor }) => {
      const { rect, table } = getTableNode({ editor }) || {};
      setState(s => ({
        ...s,
        rect,
        table,
        cellSelected: editor.state.selection.$anchor.parent.type.name === 'tableCell'
      }));
    };

    editor.on('selectionUpdate', onUpdate);
    return () => {
      editor.off('selectionUpdate', onUpdate);
    };
  }, [editor, editor.isDestroyed]);

  if (!rect) return null;

  return (
    <Portal target={document.querySelector<HTMLElement>(`#${tableMenuRefId}`) || undefined}>
      <Paper
        p={5}
        shadow="md"
        withBorder
        style={{ position: 'absolute', top: rect.top + 5, right: rect.left, zIndex: 1 }}
      >
        {cellSelected ? (
          <TableCellControls editor={editor} />
        ) : (
          <TableControls editor={editor} initialTableOptions={table?.node.attrs} />
        )}
      </Paper>
    </Portal>
  );
};
