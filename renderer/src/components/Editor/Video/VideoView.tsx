import { useDisclosure } from '@mantine/hooks';
import { Node } from '@tiptap/pm/model';
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import { VideoViewAttributes } from './Video';
import { Resizer } from '../Resizer';
import { VideoViewBubbleMenu } from './VideoViewBubbleMenu';
import cx from 'clsx';
import classes from './VideoView.module.css';

export interface VideoViewProps extends NodeViewProps {
  node: Node & { attrs: VideoViewAttributes };
}

export function VideoView(props: VideoViewProps) {
  const [drag, { open: onDragStart, close: onDragEnd }] = useDisclosure();
  const { ratio, ...attrs } = props.node.attrs;

  return (
    <NodeViewWrapper className={cx(classes.root, { [classes.drag]: drag })}>
      <video
        {...attrs}
        data-resizable
        data-drag-handle
        muted={attrs.autoPlay || attrs.controls}
        style={{ aspectRatio: ratio }}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />
      {props.selected && <Resizer onResize={props.updateAttributes} />}
      {props.selected && <VideoViewBubbleMenu {...attrs} ratio={ratio} update={props.updateAttributes} />}
    </NodeViewWrapper>
  );
}
