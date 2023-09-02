import { DependencyList } from 'react';
import { Link } from '@mantine/tiptap';
import { Extensions, EditorOptions, useEditor as useDefaultEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import Image from '@tiptap/extension-image';
import { CodeBlockPrism } from '@/components/Editor/CodeBlock/CodeBlockPrism';

export type { EditorOptions };

export const defaultExtensions: Extensions = [
  StarterKit.configure({}),
  Underline,
  Link,
  Highlight,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Image.configure({
    inline: false,
    allowBase64: false
  }),
  Placeholder.configure({
    placeholder: "Let's start writing here ..."
  }),
  Table.configure({ resizable: false }),
  TableRow,
  TableHeader,
  TableCell,
  CodeBlockPrism
];

export const useEditor = (
  { extensions = defaultExtensions, ...options }: Partial<EditorOptions> = {},
  deps?: DependencyList
) => {
  return useDefaultEditor(
    {
      extensions,
      ...options
    },
    deps
  );
};
