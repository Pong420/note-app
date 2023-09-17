/* eslint-disable @typescript-eslint/no-explicit-any */
// Copy from
// https://github.com/Hebmor/tiptap-extension-code-block-prism/tree/master
// https://github.com/ueberdosis/tiptap

import CodeBlock, { CodeBlockOptions } from '@tiptap/extension-code-block';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { PrismPlugin } from './PrismPlugin';
import { CodeBlockView } from './CodeBlockView';
import { codeblockInputRegex, codeblockFullInputRegex, codeblockTypeInputRule } from './codeblockTypeInputRule';

export interface CodeBlockPrismOptions extends CodeBlockOptions {
  defaultLanguage?: string;
}

export interface CodeBlockPrismAttributes {
  language: string;
  title: string;
  lineHighlight: number[];
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    codeBlockPrism: {
      setCodeBlock: (attributes?: CodeBlockPrismAttributes) => ReturnType;
      toggleCodeBlock: (attributes?: CodeBlockPrismAttributes) => ReturnType;
    };
  }
}

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
          default: 'plain'
        },
        title: {
          default: null
        },
        lineHighlight: {
          default: []
        }
      };
    }
    return { ...parent };
  },

  // https://github.com/ueberdosis/tiptap/issues/457#issuecomment-1221231841
  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      Tab: () => {
        this.editor
          .chain()
          .command(({ tr }) => {
            tr.insertText('  ');
            return true;
          })
          .run();
        return true;
      },
      // overriden
      ArrowDown: ({ editor }) => {
        if (!this.options.exitOnArrowDown) {
          return false;
        }

        const { state } = editor;
        const { selection } = state;
        const { $from, empty } = selection;

        if (!empty || $from.parent.type !== this.type) {
          return false;
        }

        const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2;

        if (!isAtEnd) {
          return false;
        }

        const after = $from.after();

        if (after === undefined) {
          return false;
        }

        // const nodeAfter = doc.nodeAt(after);

        // if (nodeAfter) {
        //   return false;
        // }

        return editor.commands.exitCode();
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
    return [
      codeblockTypeInputRule({
        find: codeblockInputRegex,
        type: this.type
      }),
      codeblockTypeInputRule({
        find: codeblockFullInputRegex,
        type: this.type
      })
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockView);
  }
});
