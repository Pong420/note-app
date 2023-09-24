import { ActionIcon, CopyButton } from '@mantine/core';
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import { IconCheck, IconClipboard } from '@tabler/icons-react';
import { CodeBlockPrismAttributes } from './CodeBlockPrism';
import { languageMap } from './PrismPlugin';
import cx from 'clsx';
import classes from './CodeBlockView.module.css';

const lineHeight = 1.55;

const languageLabelMap: Record<string, string> = {
  tsx: 'TSX',
  jsx: 'JSX'
};

export function CodeBlockView(props: NodeViewProps) {
  const { title, language: l = 'plain', lineHighlight: lh = [] } = { ...props.node.attrs } as CodeBlockPrismAttributes;
  const language = languageMap[l] || l;
  const languageLabel = languageLabelMap[language];
  const className = `language-${language}`;
  const lineHighlight = Array.isArray(lh) ? lh : [];

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
          <div className={cx(classes.badge, classes.language)}>{languageLabel || language}</div>
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
