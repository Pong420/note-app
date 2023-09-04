/* eslint-disable @typescript-eslint/no-explicit-any */
// Copy from
// https://github.com/Hebmor/tiptap-extension-code-block-prism/tree/master
// https://github.com/ueberdosis/tiptap

import { findChildren } from '@tiptap/core';
import { Step } from '@tiptap/pm/transform';
import { Node as ProsemirrorNode } from '@tiptap/pm/model';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { fromHtml } from 'hast-util-from-html';
import Prism from 'prismjs';
import './prism-cloud9-night-low.css';

function parseNodes(nodes: any[], className: string[] = []): { text: string; classes: string[] }[] {
  return nodes
    .map(node => {
      const classes = [...className, ...(node.properties ? node.properties.className : [])];

      if (node.children) {
        return parseNodes(node.children, classes);
      }

      return {
        text: node.value,
        classes
      };
    })
    .flat();
}

function getHighlightNodes(html: string) {
  return fromHtml(html, { fragment: true }).children;
}

function registeredLang(aliasOrLanguage: string) {
  const allSupportLang = Object.keys(Prism.languages).filter(id => typeof Prism.languages[id] === 'object');
  return Boolean(allSupportLang.find(x => x === aliasOrLanguage));
}

function getDecorations({
  doc,
  name,
  defaultLanguage = 'markdown'
}: {
  doc: ProsemirrorNode;
  name: string;
  defaultLanguage?: string;
}) {
  const decorations: Decoration[] = [];

  findChildren(doc, node => node.type.name === name).forEach(block => {
    let from = block.pos + 1;
    const language = block.node.attrs.language || defaultLanguage;
    let html: string = '';

    try {
      if (!registeredLang(language)) {
        if (language === 'tsx') {
          import('prismjs/components/prism-jsx');
        }
        import(`../../../../../node_modules/prismjs/components/prism-${language}.js`);
      }
      html = Prism.highlight(block.node.textContent, Prism.languages[language], language);
    } catch (err: any) {
      // console.error(err.message + ': "' + language + '"');
      html = Prism.highlight(block.node.textContent, Prism.languages.javascript, defaultLanguage);
    }

    const nodes = getHighlightNodes(html);

    parseNodes(nodes).forEach(node => {
      const to = from + node.text.length;

      if (node.classes.length) {
        const decoration = Decoration.inline(from, to, {
          class: node.classes.join(' '),
          spellcheck: 'false'
        });

        decorations.push(decoration);
      }

      from = to;
    });

    if (typeof language === 'string' && language) {
      decorations.push(
        Decoration.widget(0, () => {
          const node = document.createElement('div');
          node.className = 'language';
          node.textContent = language;
          node.style.position = 'absolute';
          node.style.visibility = 'hidden';
          return node;
        })
      );
    }
  });

  return DecorationSet.create(doc, decorations);
}

export function PrismPlugin({ name, defaultLanguage }: { name: string; defaultLanguage?: string }) {
  const prismjsPlugin: Plugin<any> = new Plugin({
    key: new PluginKey('prism'),

    state: {
      init: (_, { doc }) =>
        getDecorations({
          doc,
          name,
          defaultLanguage
        }),
      apply: (transaction, decorationSet, oldState, newState) => {
        const oldNodeName = oldState.selection.$head.parent.type.name;
        const newNodeName = newState.selection.$head.parent.type.name;
        const oldNodes = findChildren(oldState.doc, node => node.type.name === name);
        const newNodes = findChildren(newState.doc, node => node.type.name === name);

        if (
          transaction.docChanged &&
          // Apply decorations if:
          // selection includes named node,
          ([oldNodeName, newNodeName].includes(name) ||
            // OR transaction adds/removes named node,
            newNodes.length !== oldNodes.length ||
            // OR transaction has changes that completely encapsulte a node
            // (for example, a transaction that affects the entire document).
            // Such transactions can happen during collab syncing via y-prosemirror, for example.
            (transaction.steps as (Step & { from?: number; to: number })[]).some(({ from, to }) => {
              return (
                from !== undefined &&
                to !== undefined &&
                oldNodes.some(node => {
                  return node.pos >= from && node.pos + node.node.nodeSize <= to;
                })
              );
            }))
        ) {
          return getDecorations({
            doc: transaction.doc,
            name,
            defaultLanguage
          });
        }

        return decorationSet.map(transaction.mapping, transaction.doc);
      }
    },

    props: {
      decorations(state) {
        return prismjsPlugin.getState(state);
      }
    }
  });

  return prismjsPlugin;
}
