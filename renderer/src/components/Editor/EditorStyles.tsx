import { CSSObject, Global } from '@mantine/core';

/**
 * Some global styles rely on mantine theme, so use the Global component instead of css
 */

export function EditorStyles() {
  return (
    <Global
      styles={theme => {
        const borderColor = theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[4];
        const blue = theme.fn.variant({ variant: 'light', color: 'blue' });
        const gray = theme.fn.variant({ variant: 'light', color: 'gray' });

        const tableCss: CSSObject = {
          /* table */
          table: {
            borderCollapse: 'collapse',
            margin: '0',
            overflow: 'hidden',
            tableLayout: 'fixed',
            width: '100%',

            p: { margin: '0' }
          },

          th: {
            backgroundColor: gray.hover,
            color: theme.colorScheme === 'dark' ? gray.color : undefined
          },

          'td,th': {
            border: `1px solid ${borderColor}`,
            boxSizing: 'border-box',
            minWidth: '1em',
            padding: '3px 5px',
            position: 'relative',
            verticalAlign: 'top',
            '> *': { marginBottom: '0' }
          },

          '.selectedCell': {
            backgroundColor: blue.background,
            color: blue.color
          },

          '.column-resize-handle': {
            backgroundColor: '#adf',
            bottom: '-2px',
            position: 'absolute',
            right: '-2px',
            pointerEvents: 'none',
            top: '0',
            width: '4px'
          },

          '.tableWrapper': { padding: '1rem 0', overflowX: 'auto' },

          '.resize-cursor': { cursor: ['ew-resize', 'col-resize'] }
        };

        const gapCursorCss: CSSObject = {
          /* gap cursor */
          '.ProseMirror-gapcursor:after': {
            borderWidth: 2,
            borderColor
          },

          // to avoid overlap with table or image
          '.ProseMirror-gapcursor:first-of-type:after': {
            top: -5
          },
          '* + .ProseMirror-gapcursor.ProseMirror-gapcursor:after': {
            top: 5
          }
        };

        const imageCss = {
          '.react-renderer.node-image, .react-renderer.node-video': {
            width: 'fit-content',
            maxWidth: '100%'
          }
        };

        // not code block
        const codeCss = {
          'code:not([class*="language-"])': {
            backgroundColor: `#2C2E33`,
            padding: `0.1875rem 0.3125rem`
          }
        };

        return {
          // mutliple class name to make sure styles will be overriden by
          // https://mantine.dev/core/typography-styles-provider/
          '.tiptap.tiptap.tiptap': {
            ...tableCss,
            ...gapCursorCss,
            ...imageCss,
            ...codeCss
          }
        };
      }}
    />
  );
}
