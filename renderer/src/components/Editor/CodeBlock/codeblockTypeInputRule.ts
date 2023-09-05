import { NodeType } from '@tiptap/pm/model';
import { InputRule, InputRuleFinder } from '@tiptap/react';

const languageMap: Record<string, string> = {
  md: 'markdown',
  ts: 'typescript',
  js: 'javascript',
  javascriptreact: 'jsx',
  typescriptreact: 'tsx'
};

export const codeblockInputRegex = /^```(.*)\n$/;
export const codeblockFullInputRegex = /^```(.*)\n((.|\n)*)```\n?$/;

const parseMeta = (payload: string) => {
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
      const [l, ...metadata] = metaString.split(' ');

      let language = l || 'plain';
      language = languageMap[language] || language;

      const attributes = {
        language: languageMap[language] || language,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...metadata.reduce((r, p) => ({ ...r, ...parseMeta(p) }), {} as Record<string, any>)
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
