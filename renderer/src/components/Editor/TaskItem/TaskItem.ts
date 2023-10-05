import TipTapTaskItem from '@tiptap/extension-task-item';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TaskItemView } from './TaskItemView';

export const TaskItem = TipTapTaskItem.extend({
  // content: 'paragraph',

  addNodeView() {
    return ReactNodeViewRenderer(TaskItemView);
  }
});
