import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EditorOptions, Extensions, ReactNodeViewRenderer, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import Code from '@tiptap/extension-code';
import TaskList from '@tiptap/extension-task-list';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Editor } from '@/components/Editor';
import { clipboardTextParser } from '@/components/Editor/utils/clipboardTextParser';
import { CodeBlockPrism } from '@/components/Editor/CodeBlock/CodeBlockPrism';
import { Spotlight } from '@/components/Editor/Spotlight';
import { Image } from '@/components/Editor/Image/Image';
import { Video } from '@/components/Editor/Video/Video';
import { KeyboardButton } from '@/components/Editor/KeyboardButton/KeyboardButton';
import { Admonition } from '@/components/Editor/Admonition/Admonition';
import { HorizontalRule as HorizontalRuleComponent } from '@/components/Editor/HorizontalRule';
import { Table } from '@/components/Editor/Table/Table';
import { TaskItem } from '@/components/Editor/TaskItem/TaskItem';
import { FileJSON } from '@/types';

const extensions: Extensions = [
  StarterKit.configure({
    code: false,
    codeBlock: false,
    horizontalRule: false
  }),
  Underline,
  HorizontalRule.extend({
    addNodeView() {
      return ReactNodeViewRenderer(HorizontalRuleComponent);
    }
  }),
  Link,
  Highlight,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Image.configure({
    inline: false,
    allowBase64: false
  }),
  Video,
  Placeholder.configure({
    placeholder: "Let's start writing here ..."
  }),
  Table.configure({ resizable: false }),
  TableRow,
  TableHeader,
  TableCell,
  // Don't known why
  // With `Code.configure({...})` cannot exit code by arrow right
  // So add the code extension to override same extension in StarterKit
  Code,
  CodeBlockPrism,
  Spotlight,
  KeyboardButton,
  Admonition,
  TaskList,
  TaskItem.configure({
    nested: true
  }),
  TextStyle,
  Color
];

const editorProps: EditorOptions['editorProps'] = {
  clipboardTextParser
};

export function EditorPage() {
  const { id, title } = useParams() as { id: string; title: string };
  const [loaded, setLoaded] = useState(false);

  const onUpdate: EditorOptions['onUpdate'] = useCallback(
    ({ editor, transaction }) => {
      if (loaded && transaction.docChanged) {
        adapter.emitFileChanged({ id, title, content: editor.getJSON() });
      }
    },
    [id, title, loaded]
  );

  const editor = useEditor({
    extensions,
    editorProps,
    onUpdate,
    editable: false
  });

  useEffect(() => {
    const loadFile = async () => {
      let file = await adapter.getFile({ id });

      if (!file) {
        file = await new Promise<FileJSON>(resolve => {
          const unsubscribe = adapter.subscribeFileChanged(file => {
            if (file.id === id) {
              unsubscribe();
              resolve(file);
            }
          });
          adapter.emitFileChanged({ id, title });
        });
      }

      editor?.commands.setContent(file.content || null);
      // with delay ui without blinking when app at initial / refersh
      await new Promise(resolve => setTimeout(resolve));

      if (!file.readOnly || import.meta.env.DEV) editor?.setEditable(true);
      editor?.commands.focus(null, { scrollIntoView: false });

      return true;
    };

    loadFile()
      .then(setLoaded)
      .catch(() => void 0);
  }, [editor, id, title]);

  if (!loaded) return null;

  return <Editor editor={editor} />;
}
