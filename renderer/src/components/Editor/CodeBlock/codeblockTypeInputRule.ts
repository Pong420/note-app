import { NodeType } from '@tiptap/pm/model';
import { InputRule, InputRuleFinder } from '@tiptap/react';
import { CodeBlockPrismAttributes } from './CodeBlockPrism';

export const codeblockInputRegex = /^```(.*)\n$/;
export const codeblockFullInputRegex = /^```(.*)\n((.|\n)*)```\n?$/;

const parseMeta = (payload: string, index: number) => {
  const language = payload.match(/(^[a-z]+$)/i);
  if (index === 0 && language) {
    return { language: payload };
  }

  const keyValue = payload.match(/(.*)=(.*)/);
  if (keyValue) {
    const [, key, value] = keyValue;
    return { [key.trim()]: value.replace(/^["|']/, '').replace(/["|']$/, '') };
  }

  const lineHighlight = payload.match(/{(.*)}/)?.[1];
  if (lineHighlight) {
    return {
      lineHighlight: lineHighlight.split(',').flatMap(range => {
        const [min, max = min] = range.split('-').map(Number) as [number, number | undefined];
        return Array.from({ length: max - min + 1 }, (_, i) => min + i);
      })
    };
  }

  return { [payload]: true };
};

// https://github.com/ueberdosis/tiptap/blob/7832b96afbfc58574785043259230801e179310f/packages/core/src/inputRules/textblockTypeInputRule.ts#L13
export function codeblockTypeInputRule(config: { find: InputRuleFinder; type: NodeType }) {
  return new InputRule({
    find: config.find,
    handler: ({ state, range, match }) => {
      const $start = state.doc.resolve(range.from);
      const [metaString = '', content = ''] = match.slice(1).filter(s => !!s);
      const metadata = metaString.split(' ');

      const attributes = {
        ...metadata.reduce((r, p, i) => ({ ...r, ...parseMeta(p, i) }), {} as CodeBlockPrismAttributes)
      };

      if (!$start.node(-1).canReplaceWith($start.index(-1), $start.indexAfter(-1), config.type)) {
        return null;
      }

      state.tr
        .delete(range.from, range.to)
        .setBlockType(range.from, range.from, config.type, attributes)
        .insertText(content.trim().replace('`', '') || '');
    }
  });
}
