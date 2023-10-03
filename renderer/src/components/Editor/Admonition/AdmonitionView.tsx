import { NodeViewProps } from '@tiptap/core';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import { Blockquote } from '@mantine/core';
import { IconAlertTriangleFilled, IconBulb, IconFlame, IconInfoCircle, TablerIconsProps } from '@tabler/icons-react';
import cx from 'clsx';
import classes from './Admonition.module.css';

export function AdmonitionView(props: NodeViewProps) {
  const { type } = props.node.attrs;

  let Icon: React.ComponentType<TablerIconsProps> = IconInfoCircle;
  let color = 'gray';

  if (type === 'info') {
    color = 'blue';
  }

  if (type === 'tip') {
    Icon = IconBulb;
    color = 'teal';
  }

  if (type === 'caution') {
    Icon = IconAlertTriangleFilled;
    color = 'yellow';
  }

  if (type === 'danger') {
    Icon = IconFlame;
    color = 'red';
  }

  return (
    <NodeViewWrapper className={cx(classes.root, { [classes.selected]: props.selected })}>
      <Blockquote color={color} radius="xs" iconSize={30} icon={<Icon />}>
        <NodeViewContent className={classes.content} />
      </Blockquote>
    </NodeViewWrapper>
  );
}
