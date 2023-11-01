import { Flex, Group, Text } from '@mantine/core';
import { IconChevronRight, type TablerIconsProps } from '@tabler/icons-react';
import cx from 'clsx';
import classes from './ModalRow.module.css';

export interface ModalRowProps {
  icon?: React.ComponentType<TablerIconsProps>;
  title: React.ReactNode;
  text?: string;
  rightSection?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
}

export function ModalRow({ icon: Icon, title, text, children, rightSection, onClick }: ModalRowProps) {
  if (!!onClick && !rightSection) {
    rightSection = <IconChevronRight size="1.2rem" strokeWidth={2} />;
  }

  return (
    <Flex
      className={cx(classes.root, { [classes.interactive]: !!onClick })}
      align="center"
      justify="space-between"
      onClick={onClick}
    >
      <Group gap="md">
        {Icon && <Icon size="1.25rem" />}
        {title}
      </Group>
      <Group gap={5} style={{ flex: '0 0 auto%' }}>
        {text && (
          <Text size="sm" c="dimmed">
            {text}
          </Text>
        )}
        {children || rightSection}
      </Group>
    </Flex>
  );
}
