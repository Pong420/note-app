import { Container } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { Editor as TipTapEditor } from '@tiptap/react';
import { TableBubbleMenu, tableMenuRefId } from './Table/TableBubbleMenu';
import { TextBubbleMenu } from './TextBubbleMenu';
import classes from './Editor.module.css';
import './styles/code.css';
import './styles/gapCursor.css';
import './styles/list.css';
import './styles/media.css';
import './styles/table.css';
import './styles/spotlight.css';
import './styles/tasklist.css';
import './styles/highlight.css';

export interface EditorProps {
  editor?: TipTapEditor | null;
}

export function Editor({ editor = null }: EditorProps) {
  return (
    <Container w="100%" className="__stretch">
      <RichTextEditor className={classes.editor} editor={editor} withCodeHighlightStyles={false}>
        <RichTextEditor.Content className={classes.content}>
          <div id={tableMenuRefId}></div>
        </RichTextEditor.Content>
        {editor && <TableBubbleMenu editor={editor} />}
        {editor && <TextBubbleMenu editor={editor} />}
      </RichTextEditor>
    </Container>
  );
}
