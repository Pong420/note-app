import { Slice, Fragment, Node } from '@tiptap/pm/model';
import { EditorProps } from '@tiptap/pm/view';

// Not sure this is necessary
// Using the copy button in docusaurus code block and paste it into editor
// Tiptap or ProseMirror will transform the text into different paragraph
export const clipboardTextParser: EditorProps['clipboardTextParser'] = (text, context) => {
  const fragment = Fragment.from(
    Node.fromJSON(context.doc.type.schema, { type: 'paragraph', content: [{ type: 'text', text }] })
  );
  return Slice.maxOpen(fragment);
};
