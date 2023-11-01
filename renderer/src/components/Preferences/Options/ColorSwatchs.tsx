import { ColorSwatch, Group } from '@mantine/core';
import cx from 'clsx';

const size = 24;
const spacing = 5;

export interface ColorSwatchsProps {
  className?: string;
  colors: string[];
  onClick?: (color: string) => void;
  onDoubleClick?: (color: string) => void;
  getColor?: (color: string) => string;
  children?: (color: string) => React.ReactNode;
}

export function ColorSwatchs({
  className = '',
  colors,
  getColor,
  children,
  onClick,
  onDoubleClick
}: ColorSwatchsProps) {
  return (
    <Group justify="flex-end" wrap="wrap" gap={spacing} w={`${(size + spacing) * 6 - spacing}px`}>
      {colors.map(color => {
        const c = getColor?.(color) || color;
        return (
          <ColorSwatch
            className={cx('css-tooltip', className)}
            color={c}
            key={color}
            size={size}
            radius="sm"
            component="button"
            title={color.replace(/^\w/, s => s.toUpperCase())}
            style={{ color: '#fff', cursor: 'pointer' }}
            onClick={() => onClick?.(color)}
            onDoubleClick={() => onDoubleClick?.(color)}
          >
            {children?.(color)}
          </ColorSwatch>
        );
      })}
    </Group>
  );
}
