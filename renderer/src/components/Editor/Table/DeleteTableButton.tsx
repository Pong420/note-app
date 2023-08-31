import { RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';
import { IconTableMinus } from '@tabler/icons-react';

const title = 'Delete Table';

export function DeleteTableButton() {
  const { editor } = useRichTextEditorContext();

  return (
    <RichTextEditor.Control aria-label={title} title={title} onClick={() => editor.chain().focus().deleteTable().run()}>
      <IconTableMinus stroke={1.5} size="1rem" />
    </RichTextEditor.Control>
  );
}
