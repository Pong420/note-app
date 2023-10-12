import { RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';
import { IconTablePlus } from '@tabler/icons-react';

const title = 'Insert Table';

export function InsertTableButton() {
  const { editor } = useRichTextEditorContext();

  return (
    <RichTextEditor.Control
      aria-label={title}
      title={title}
      onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
    >
      <IconTablePlus stroke={1.5} size="1rem" />
    </RichTextEditor.Control>
  );
}
