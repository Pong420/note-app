import { ReactNodeViewRenderer } from '@tiptap/react';
import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core';
import { AdmonitionView } from './AdmonitionView';

export interface AdmonitionOptions {}

export const Admonition = Node.create<AdmonitionOptions>({
  name: 'admonition',

  content: 'text*',

  group: 'block',

  code: true,

  defining: true,

  whitespace: 'pre',

  addAttributes() {
    return {
      type: { default: 'info' }
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-admonition]'
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ 'data-admonition': HTMLAttributes.type })];
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: /(?:^|\s)((?::::)((?:(note|tip|info|caution|danger))))$/,
        type: this.type,
        getAttributes(match) {
          return { type: match[3] };
        }
      })
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AdmonitionView);
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () => {
        const { empty, $anchor } = this.editor.state.selection;
        const isAtStart = $anchor.pos === 1;

        if (!empty || $anchor.parent.type.name !== this.name) {
          return false;
        }

        if (isAtStart || !$anchor.parent.textContent.length) {
          return this.editor.commands.clearNodes();
        }

        return false;
      }
    };
  }
});
