import { Checkbox } from '@mantine/core';
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import classes from './TaskItemView.module.css';

export function TaskItemView(props: NodeViewProps) {
  return (
    <NodeViewWrapper className={classes.root}>
      <Checkbox
        checked={props.node.attrs.checked}
        onChange={event => props.updateAttributes({ checked: event.target.checked })}
      />
      <NodeViewContent className={classes.content} />
    </NodeViewWrapper>
  );
}
