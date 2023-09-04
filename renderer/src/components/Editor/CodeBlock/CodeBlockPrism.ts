// Copy from
// https://github.com/Hebmor/tiptap-extension-code-block-prism/tree/master
// https://github.com/ueberdosis/tiptap

import CodeBlock, { CodeBlockOptions, backtickInputRegex, tildeInputRegex } from '@tiptap/extension-code-block';
import { ReactNodeViewRenderer, textblockTypeInputRule } from '@tiptap/react';
import { PrismPlugin } from './PrismPlugin';
import { CodeBlockView } from './CodeBlockView';

export interface CodeBlockPrismOptions extends CodeBlockOptions {
  defaultLanguage?: string;
}

const languageMap: Record<string, string> = {
  ts: 'typescript',
  js: 'javascript',
  md: 'markdown'
};

export const CodeBlockPrism = CodeBlock.extend<CodeBlockPrismOptions>({
  addOptions() {
    return {
      ...this.parent?.()
    };
  },

  addAttributes() {
    const parent = this.parent?.();
    if (parent && 'language' in parent) {
      return {
        ...parent,
        language: {
          ...parent['language'],
          default: 'markdown'
        }
      };
    }
    return { ...parent };
  },

  // https://github.com/ueberdosis/tiptap/issues/457#issuecomment-1221231841
  addKeyboardShortcuts() {
    return {
      Tab: () => {
        this.editor
          .chain()
          .command(({ tr }) => {
            tr.insertText('  ');
            return true;
          })
          .run();
        return true;
      }
    };
  },

  addProseMirrorPlugins() {
    return [
      ...(this.parent?.() || []),
      PrismPlugin({
        name: this.name,
        defaultLanguage: this.options.defaultLanguage
      })
    ];
  },

  addInputRules() {
    return [backtickInputRegex, tildeInputRegex].map(find =>
      textblockTypeInputRule({
        find,
        type: this.type,
        getAttributes: match => ({
          language: languageMap[match[1]] || match[1]
        })
      })
    );
  },

  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockView);
  }
});
