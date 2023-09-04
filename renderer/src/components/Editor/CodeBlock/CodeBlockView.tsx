import { ActionIcon, CopyButton, createStyles } from '@mantine/core';
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import { IconCheck, IconClipboard } from '@tabler/icons-react';

const useStyles = createStyles(theme => {
  const color = theme.colors[theme.primaryColor][9];

  return {
    root: {
      position: 'relative',
      paddingTop: `36px !important`
    },
    badge: {
      position: 'absolute',
      top: 10,
      fontSize: 10,
      textTransform: 'capitalize',
      backgroundColor: color,
      padding: '0.1rem 0.5rem',
      lineHeight: `1rem`,
      borderRadius: `5px 5px 5px 5px`,
      color: '#fff'
    },
    copy: {
      position: 'absolute',
      top: 5,
      right: 10
    }
  };
});

export function CodeBlockView(props: NodeViewProps) {
  const { classes } = useStyles();
  return (
    <NodeViewWrapper>
      <pre className={classes.root}>
        <NodeViewContent as="code" />
        <div className={classes.badge}>{props.node.attrs.language}</div>
        <CopyButton value={props.node.content.firstChild?.text || ''} timeout={2000}>
          {({ copied, copy }) => (
            <ActionIcon className={classes.copy} color={copied ? 'teal' : 'gray'} onClick={copy}>
              {copied ? <IconCheck size="1rem" /> : <IconClipboard size="1rem" />}
            </ActionIcon>
          )}
        </CopyButton>
      </pre>
    </NodeViewWrapper>
  );
}
