import { useRef } from 'react';
import { createStyles } from '@mantine/core';

const useStyles = createStyles(theme => {
  const borderWidth = 1;
  const handleSize = 8;
  const color = theme.colors[theme.primaryColor][6];
  return {
    root: {
      position: 'absolute',
      top: 0,
      left: 0,

      borderWidth,
      borderStyle: 'solid',
      borderColor: color,
      width: '100%',
      height: '100%',

      pointerEvents: 'none'
    },
    handle: {
      width: handleSize,
      height: handleSize,
      backgroundColor: color,
      position: 'absolute',
      pointerEvents: 'all'
    },
    topLeft: {
      cursor: 'nwse-resize',
      top: -handleSize / 2,
      left: -handleSize / 2
    },
    topRight: {
      cursor: 'nesw-resize',
      top: -handleSize / 2,
      right: -handleSize / 2
    },
    bottomLeft: {
      cursor: 'nesw-resize',
      left: -handleSize / 2,
      bottom: -handleSize / 2
    },
    bottomRight: {
      cursor: 'nwse-resize',
      right: -handleSize / 2,
      bottom: -handleSize / 2
    }
  };
});

export interface Size {
  width: number;
  height: number;
  maxWidth: number;
}

export interface ResizerProps {
  onResize: (size: Size) => void;
}

export function Resizer({ onResize }: ResizerProps) {
  const { classes, cx } = useStyles();
  const ref = useRef<HTMLDivElement>(null);

  const handler = (key: keyof ReturnType<typeof useStyles>['classes']): React.ComponentProps<'div'> => {
    const onMouseDown = (event: React.MouseEvent) => {
      const el = ref.current?.parentElement?.querySelector<HTMLImageElement>('[data-resizable]');
      const container = ref.current?.closest<HTMLElement>('.tiptap.ProseMirror');

      if (!el || !container) return;

      const factor = /left/i.test(key) ? -1 : 1;
      const computedStyle = getComputedStyle(container);

      let x = event.pageX;
      let y = event.pageY;

      const maxWidth = container.clientWidth - parseInt(computedStyle.paddingLeft, 10) * 2;

      const onMouseMove = (event: MouseEvent) => {
        const deltaX = (event.pageX - x) * factor;
        const deltaY = (event.pageY - y) * factor;
        const resizedWidth = Math.min(maxWidth, el.offsetWidth + deltaX);
        const resizedHeight = el.offsetHeight + deltaY;

        x = event.pageX;
        y = event.pageY;

        onResize({
          maxWidth: Math.min(100, 100 * (resizedWidth / maxWidth)),
          width: resizedWidth,
          height: resizedHeight
        });
      };

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    };

    return { onMouseDown, className: cx(classes.handle, classes[key]) };
  };

  return (
    <div draggable={false} ref={ref} className={classes.root}>
      <div {...handler('topLeft')} />
      <div {...handler('topRight')} />
      <div {...handler('bottomLeft')} />
      <div {...handler('bottomRight')} />
    </div>
  );
}
