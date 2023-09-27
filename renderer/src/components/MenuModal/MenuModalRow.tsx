import { Flex, Group, Text } from '@mantine/core';
import { IconChevronRight, type TablerIconsProps } from '@tabler/icons-react';
import cx from 'clsx';
import classes from './MenuModalRow.module.css';

export interface MenuModalRowProps {
  icon?: React.ComponentType<TablerIconsProps>;
  title: React.ReactNode;
  text?: string;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
}

export function MenuModalRow({ icon: Icon, title, text, rightSection, onClick }: MenuModalRowProps) {
  if (!!onClick && !rightSection) {
    rightSection = <IconChevronRight size="1.2rem" strokeWidth={2} />;
  }

  return (
    <Flex
      className={cx(classes.root, { [classes.interactive]: !!onClick })}
      w="100%"
      h="60px"
      pl="lg"
      pr="lg"
      justify="space-between"
      align="center"
      onClick={onClick}
    >
      <Group gap="md">
        {Icon && <Icon size="1.25rem" />}
        {title}
      </Group>
      <Group gap={5} style={{ flex: '0 0 auto' }}>
        {text && (
          <Text size="sm" c="dimmed">
            {text}
          </Text>
        )}
        {rightSection}
      </Group>
    </Flex>
  );
}
