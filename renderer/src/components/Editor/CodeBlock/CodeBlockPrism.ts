// Copy from
// https://github.com/Hebmor/tiptap-extension-code-block-prism/tree/master
// https://github.com/ueberdosis/tiptap

import CodeBlock, { CodeBlockOptions } from '@tiptap/extension-code-block';
import { PrismPlugin } from './PrismPlugin';

export interface CodeBlockPrismOptions extends CodeBlockOptions {
  defaultLanguage?: string;
}

export const CodeBlockPrism = CodeBlock.extend<CodeBlockPrismOptions>({
  addOptions() {
    return {
      ...this.parent?.()
    };
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
  }
});
