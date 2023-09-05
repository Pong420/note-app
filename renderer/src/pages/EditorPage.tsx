import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from '@mantine/tiptap';
import { EditorProps } from '@tiptap/pm/view';
import { EditorOptions, Extensions, useEditor } from '@tiptap/react';
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
import { Editor } from '@/components/Editor';
import { clipboardTextParser } from '@/components/Editor/clipboardTextParser';
import { CodeBlockPrism } from '@/components/Editor/CodeBlock/CodeBlockPrism';
import { fileManager } from '@/utils/FileManager';

const extensions: Extensions = [
  StarterKit.configure({
    codeBlock: false
  }),
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

const editorProps: EditorProps = {
  clipboardTextParser
};

export function EditorPage() {
  const { id, title } = useParams() as { id?: string; title: string };
  const [loaded, setLoaded] = useState(false);

  const onUpdate: EditorOptions['onUpdate'] = useCallback(
    ({ editor }) => {
      fileManager.save({ id, title, content: editor.getJSON() });
    },
    [id, title]
  );

  const editor = useEditor({
    extensions,
    editorProps,
    onUpdate
  });

  useEffect(() => {
    const run = async () => {
      if (id) {
        const file = await adapter.getFile({ id });
        if (file) {
          editor?.commands.setContent(file.content);
          await adapter.updateLastVisits({ id });
        }
      }
      return true;
    };

    run()
      .then(setLoaded)
      .catch(() => void 0);
  }, [editor, id, title]);

  if (!loaded) return null;

  return <Editor editor={editor} />;
}
