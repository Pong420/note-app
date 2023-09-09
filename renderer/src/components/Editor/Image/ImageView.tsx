import { createStyles } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Node } from '@tiptap/pm/model';
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import { ImageViewAttributes } from './Image';
import { ImageViewBubbleMenu } from './ImageVieweBubbleMenu';
import { Resizer } from './Resizer';

export interface ImageViewProps extends NodeViewProps {
  node: Node & { attrs: ImageViewAttributes };
}

const useStyles = createStyles(() => {
  return {
    root: {
      position: 'relative',
      height: 'auto',
      display: 'block',

      [`&& img`]: {
        position: 'relative',
        display: 'block',
        maxWidth: '100%',
        height: 'auto'
      }
    },
    drag: {
      '*:not(img)': {
        display: 'none'
      }
    }
  };
});

// referenes
// https://github.com/breakerh/tiptap-image-resize/blob/main/src/component/ImageResizeComponent.tsx
export function ImageView(props: ImageViewProps) {
  const { classes, cx } = useStyles();
  const [dragStart, drag] = useDisclosure();
  const { ratio, ...attrs } = props.node.attrs as ImageViewAttributes;

  return (
    <NodeViewWrapper className={cx(classes.root, { [classes.drag]: dragStart })}>
      <img
        alt=""
        {...attrs}
        data-drag-handle
        style={{ aspectRatio: ratio }}
        onDragStart={drag.open}
        onDragEnd={drag.close}
      />
      {props.selected && <Resizer selected={props.selected} onResize={props.updateAttributes} />}
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
