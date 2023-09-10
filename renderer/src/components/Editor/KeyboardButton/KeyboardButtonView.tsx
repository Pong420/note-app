import { Kbd } from '@mantine/core';
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';

export function KeyboardButtonView(props: NodeViewProps) {
  return (
    <NodeViewWrapper as="span">
      <Kbd pos="relative" m="0 0.3rem">
        {props.node.attrs.content}
      </Kbd>
    </NodeViewWrapper>
  );
}
