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
  }
});
