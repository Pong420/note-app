import { Divider } from '@mantine/core';
import { NodeViewWrapper } from '@tiptap/react';

export function HorizontalRule() {
  return (
    <NodeViewWrapper>
      <Divider mb="xs" />
    </NodeViewWrapper>
  );
}
