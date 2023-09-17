import { NodeType } from '@tiptap/pm/model';
import { InputRule, InputRuleFinder } from '@tiptap/react';

export const tableInputRegex = /(?:^|\s)((?:table\[)((?:\d+.{1}\d+))(?:\]))$/;

export function tableInputRule(config: { find: InputRuleFinder; type: NodeType }) {
  return new InputRule({
    find: config.find,
    handler: ({ state, range, match, commands }) => {
      const [cols, rows] = (match[2]?.match(/\d+/g) || []).map(Number);
      state.tr.delete(range.from, range.to);
      commands.insertTable({ cols, rows, withHeaderRow: true });
    }
  });
}
