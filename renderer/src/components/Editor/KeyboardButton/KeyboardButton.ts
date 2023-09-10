import { ReactNodeViewRenderer } from '@tiptap/react';
import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core';
import { KeyboardButtonView } from './KeyboardButtonView';

export interface KeyboardButtonOptions {}

export const KeyboardButton = Node.create<KeyboardButtonOptions>({
  name: 'kbd',

  group: 'inline',

  inline: true,

  whitespace: 'normal',

  addAttributes() {
    return {
      content: { default: null }
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-kbd]'
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes({ 'data-kbd': HTMLAttributes.content })];
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: /(?:^|\s)((?:kbd\[)((?:.*))(?:\]))$/,
        type: this.type,
        getAttributes(match) {
          return { content: match[2] };
        }
      })
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(KeyboardButtonView);
  }
});
