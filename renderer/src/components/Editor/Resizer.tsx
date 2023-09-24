import { useRef } from 'react';
import cx from 'clsx';
import classes from './Resizer.module.css';

export interface Size {
  width: number;
  height: number;
  maxWidth: number;
}

export interface ResizerProps {
  onResize: (size: Size) => void;
}

export function Resizer({ onResize }: ResizerProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handler = (key: string): React.ComponentProps<'div'> => {
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
