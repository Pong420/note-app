import { ActionIcon, CopyButton, createStyles } from '@mantine/core';
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import { IconCheck, IconClipboard } from '@tabler/icons-react';

const top = 40;
const lineHeight = 1.55;

const useStyles = createStyles(theme => {
  const color = theme.colors[theme.primaryColor][6];

  return {
    root: {
      position: 'relative',
      paddingTop: `${top}px !important`,
      lineHeight
    },
    code: {},
    head: {
      position: 'absolute',
      top: 10,
      fontSize: 10,
      lineHeight: `1rem`,
      display: 'flex',
      gap: 10
    },
    content: {
      position: 'relative',
      width: `100%`,
      height: `100%`
    },
    badge: {
      backgroundColor: color,
      padding: '0.1rem 0.5rem',
      borderRadius: `5px 5px 5px 5px`,
      color: '#fff'
    },
    language: {
      textTransform: 'capitalize'
    },
    copy: {
      position: 'absolute',
      top: 5,
      right: 10
    },
    lines: {
      position: 'absolute',
      left: `-1.8em`,
      right: `-1.8em`,

      height: '100%',
      overflow: 'hidden',

      '+ code': {
        position: 'relative',
        lineHeight: `${lineHeight}em`
      }
    },
    lineHighlight: {
      height: `${lineHeight}em`,
      backgroundColor: 'rgb(52 58 64 / 60%)',
      position: 'absolute',
      left: 0,
      right: 0
    }
  };
});

const languageLabelMap: Record<string, string> = {
  tsx: 'TSX',
  jsx: 'JSX'
};

export function CodeBlockView(props: NodeViewProps) {
  const { classes, cx } = useStyles();
  const title = props.node.attrs.title;
  const language = props.node.attrs.language;
  const lineHighlight = (props.node.attrs.lineHighlight || []) as number[];
  const className = `language-${language}`;

  return (
    <NodeViewWrapper>
      <pre className={cx(classes.root, className)}>
        <div className={classes.content}>
          <div className={classes.lines}>
            {lineHighlight?.map(l => (
              <div key={l} className={classes.lineHighlight} style={{ top: `${(l - 1) * lineHeight}em` }} />
            ))}
          </div>
          <NodeViewContent as="code" className={cx(className, classes.code)} spellCheck={false} />
        </div>

        <div className={classes.head}>
          <div className={cx(classes.badge, classes.language)}>{languageLabelMap[language] || language}</div>
          {title && <div className={classes.badge}>{title}</div>}
        </div>

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
