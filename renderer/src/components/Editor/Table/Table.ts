import TiptapTable from '@tiptap/extension-table';
import { Attribute } from '@tiptap/core';
import { tableInputRule, tableInputRegex } from './tableInputRule';

export const tableAttributes = {
  width: '',
  height: '',
  border: '',
  bordercolor: '',
  padding: '',
  condition: ''
};

export const Table = TiptapTable.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      ...Object.entries(tableAttributes).reduce(
        (r, [k, v]) => ({
          ...r,
          [k]: {
            default: v === '' ? undefined : v
          }
        }),
        {} as Record<string, Partial<Attribute>>
      )
    };
  },

  addInputRules() {
    return [
      tableInputRule({
        find: tableInputRegex,
        type: this.type
      })
    ];
  }
});
