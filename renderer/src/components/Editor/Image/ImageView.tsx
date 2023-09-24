import { useDisclosure } from '@mantine/hooks';
import { Node } from '@tiptap/pm/model';
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import { ImageViewAttributes } from './Image';
import { ImageViewBubbleMenu } from './ImageVieweBubbleMenu';
import { Resizer } from '../Resizer';
import cx from 'clsx';
import classes from './ImageView.module.css';

export interface ImageViewProps extends NodeViewProps {
  node: Node & { attrs: ImageViewAttributes };
}

// referenes
// https://github.com/breakerh/tiptap-image-resize/blob/main/src/component/ImageResizeComponent.tsx
export function ImageView(props: ImageViewProps) {
  const [drag, { open: onDragStart, close: onDragEnd }] = useDisclosure();
  const { ratio, ...attrs } = props.node.attrs as ImageViewAttributes;

  return (
    <NodeViewWrapper className={cx(classes.root, { [classes.drag]: drag })}>
      <img
        alt=""
        {...attrs}
        data-resizable
        data-drag-handle
        style={{ aspectRatio: ratio }}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />
      {props.selected && <Resizer onResize={props.updateAttributes} />}
      {props.selected && (
        <ImageViewBubbleMenu
          {...props.node.attrs}
          onSubmit={props.updateAttributes}
          ratio={ratio ?? attrs.width / attrs.height}
        />
      )}
    </NodeViewWrapper>
  );
}
