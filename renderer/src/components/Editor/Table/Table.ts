import TiptapTable from '@tiptap/extension-table';
import { tableInputRule, tableInputRegex } from './tableInputRule';

export const Table = TiptapTable.extend({
  addInputRules() {
    return [
      tableInputRule({
        find: tableInputRegex,
        type: this.type
      })
    ];
  },
  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      Backspace({ editor }) {
        const { empty, $anchor } = editor.state.selection;
        const isAtStart = $anchor.pos === 4;

        if (!editor.isActive('table')) return false;

        if (isAtStart && empty) {
          return editor.commands.deleteTable();
        }

        return false;
      }
    };
  }
});
