import { ActionIcon, Popover, Tooltip } from '@mantine/core';
import { TablerIconsProps } from '@tabler/icons-react';
import { usePreferences } from '@/hooks/usePreferences';
import cx from 'clsx';

export interface IconButtonProps extends React.ComponentProps<typeof ActionIcon<'button'>> {
  icon?: React.ComponentType<TablerIconsProps>;
  popover?: React.ReactNode;
  tooltip?: React.ReactNode;
  active?: boolean;
  title: string;
}

export function IconButton({
  icon: Icon,
  tooltip,
  popover,
  active,
  color: colorProp,
  variant: variantProp,
  children,
  className,
  title,
  ...props
}: IconButtonProps) {
  const darkMode = usePreferences('theme.darkMode');
  const [variant, color] = active
    ? (['filled', 'var(--mantine-primary-color-filled)'] as const)
    : ([variantProp || 'default', colorProp ?? (darkMode ? 'gray' : 'dark')] as const);

  let content = (
    <ActionIcon
      {...props}
      className={cx(className, 'mantine-IconButton')}
      variant={variant}
      color={color}
      title={title}
      aria-label={title}
      display="flex"
    >
      {Icon && <Icon stroke={1.5} size="1.2rem" />}
      {children}
    </ActionIcon>
  );

  if (tooltip) {
    content = (
      <Tooltip withinPortal withArrow label={tooltip}>
        {content}
      </Tooltip>
    );
  }

  if (popover) {
    content = (
      <Popover withArrow>
        <Popover.Target>{content}</Popover.Target>
        <Popover.Dropdown>{popover}</Popover.Dropdown>
      </Popover>
    );
  }

  return content;
}
