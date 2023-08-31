import { ActionIcon, Popover, Tooltip } from '@mantine/core';
import { TablerIconsProps } from '@tabler/icons-react';
import { usePreferences } from '@/hooks/usePreferences';

export interface IconButtonProps extends React.ComponentProps<typeof ActionIcon<'button'>> {
  icon: React.ComponentType<TablerIconsProps>;
  popover?: React.ReactNode;
  tooltip?: React.ReactNode;
}

export function IconButton({ icon: Icon, tooltip, popover, color, ...props }: IconButtonProps) {
  const darkMode = usePreferences('theme.darkMode');

  let content = (
    <ActionIcon size="lg" variant="default" {...props} color={color ?? (darkMode ? 'gray' : 'dark')}>
      <Icon size="1.2rem" />
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
