import { createStyles } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { Editor as TipTapEditor } from '@tiptap/react';
import { TableBubbleMenu, tableMenuRefId } from './Table/TableBubbleMenu';
import { EditorStyles } from './EditorStyles';

export interface EditorProps {
  editor?: TipTapEditor | null;
}

const useStyles = createStyles(theme => {
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      margin: 'auto'
    },
    editor: {
      border: 0,
      flex: '1 1 auto',
      display: 'flex',
      flexDirection: 'column',
      padding: 0
    },
    content: {
      width: `100%`,
      flex: '1 1 auto',
      padding: `${theme.spacing.xs} ${theme.spacing.xs}`,
      display: 'flex',
      flexDirection: 'column',

      '.mantine-RichTextEditor-content': {
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 auto'
      },

      '.ProseMirror': {
        flex: '1 1 auto'
      }
    }
  };
});

export function Editor({ editor = null }: EditorProps) {
  const { classes } = useStyles();

  return (
    <div className={classes.root}>
      <RichTextEditor className={classes.editor} editor={editor}>
        <RichTextEditor.Content className={classes.content}>
          <div id={tableMenuRefId}></div>
        </RichTextEditor.Content>
        {editor && <TableBubbleMenu editor={editor} />}
        <EditorStyles />
      </RichTextEditor>
    </div>
  );
}
