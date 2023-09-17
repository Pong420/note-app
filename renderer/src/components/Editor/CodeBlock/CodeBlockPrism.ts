/* eslint-disable @typescript-eslint/no-explicit-any */
// Copy from
// https://github.com/Hebmor/tiptap-extension-code-block-prism/tree/master
// https://github.com/ueberdosis/tiptap

import { ContentMatch } from '@tiptap/pm/model';
import { Selection } from '@tiptap/pm/state';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { default as CodeBlock, CodeBlockOptions } from '@tiptap/extension-code-block';
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

function defaultBlockAt(match: ContentMatch) {
  for (let i = 0; i < match.edgeCount; i++) {
    const { type } = match.edge(i);
    if (type.isTextblock && !type.hasRequiredAttrs()) return type;
  }
  return null;
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
      // overriden the default function in tiptap
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

        // `editor.commands.exitCode()` will insert a new paragraph which not my expected
        // so, copy the original function from
        // https://github.com/ProseMirror/prosemirror-commands/blob/760c1f15cd55e842647305af4530d829574efb75/src/commands.ts#L308
        // and slightly change it

        const { $head, $anchor } = state.selection;
        if (!$head.parent.type.spec.code || !$head.sameParent($anchor)) return false;
        const above = $head.node(-1),
          after = $head.indexAfter(-1),
          type = defaultBlockAt(above.contentMatchAt(after));
        if (!type || !above.canReplaceWith(after, after, type)) return false;
        const pos = $head.after(),
          tr = state.tr.insertText('', pos);
        tr.setSelection(Selection.near(tr.doc.resolve(pos), 1));
        this.editor.view.dispatch(tr.scrollIntoView());
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
