import TiptapTableCell from '@tiptap/extension-table-cell';
import { Attribute } from '@tiptap/core';

export const tableCellAttributes = {
  width: '',
  height: '',
  align: 'center',
  valign: 'top',
  bgcolor: '',

  m_width: '',
  m_height: '',

  text_m: ''
};

export const TableCell = TiptapTableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      ...Object.entries(tableCellAttributes).reduce(
        (r, [k, v]) => ({
          ...r,
          [k]: {
            default: v === '' ? undefined : v
          }
        }),
        {} as Record<string, Partial<Attribute>>
      )
    };
  }
});
