import { Editor } from '@/components/Editor/Editor';
import { useEditor } from '@/hooks/useEditor';

export function EditorPage() {
  const editor = useEditor({});
  return <Editor editor={editor} />;
}
