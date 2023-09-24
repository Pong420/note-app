// import { getMenuColors } from '@/components/MenuModal/colors';
import { Flex, Group, Text } from '@mantine/core';
import { IconChevronRight, type TablerIconsProps } from '@tabler/icons-react';
import cx from 'clsx';

export interface MenuModalRowProps {
  icon?: React.ComponentType<TablerIconsProps>;
  title: React.ReactNode;
  text?: string;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
}

// FIXME:
// const useStyles = createStyles(theme => {
//   const [, backgroundColor] = getMenuColors(theme.colorScheme);
//   return {
//     root: {
//       backgroundColor
//     },
//     interactive: {
//       cursor: 'pointer',

//       '&:hover': {
//         backgroundColor: theme.fn.rgba(theme.fn.lighten(backgroundColor, 0.5), 0.3)
//       }
//     }
//   };
// });

const classes = {} as Record<string, string>;

export function MenuModalRow({ icon: Icon, title, text, rightSection, onClick }: MenuModalRowProps) {
  // const { classes, cx } = useStyles();

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
          <Text size="sm" color="dimmed">
            {text}
          </Text>
        )}
        {rightSection}
      </Group>
    </Flex>
  );
}
