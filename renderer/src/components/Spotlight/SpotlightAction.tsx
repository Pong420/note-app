import { createStyles, UnstyledButton, Group, Text, Center, Badge, rem } from '@mantine/core';
import { SpotlightAction as ISpotlightAction, SpotlightActionProps } from '@mantine/spotlight';
import { FileJSON } from '@/types';

export type SpotlightActionSchema = ISpotlightAction | SpotlightFileAction;

export interface SpotlightFileAction extends ISpotlightAction {
  file: FileJSON;
}

const useStyles = createStyles(theme => ({
  action: {
    position: 'relative',
    display: 'block',
    width: '100%',
    padding: `${rem(6)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    ...theme.fn.hover({
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[1]
    }),

    '&[data-hovered]': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[1]
    },

    '& + &': {
      marginTop: rem(5)
    }
  }
}));

export function SpotlightAction({
  action: a,
  styles,
  classNames,
  hovered,
  onTrigger,
  highlightQuery,
  ...others
}: SpotlightActionProps) {
  const action = a as SpotlightActionSchema;
  const { classes } = useStyles(undefined, { styles, classNames, name: 'Spotlight' });

  return (
    <UnstyledButton
      className={classes.action}
      data-hovered={hovered || undefined}
      tabIndex={-1}
      onMouseDown={event => event.preventDefault()}
      onClick={onTrigger}
      {...others}
    >
      <Group noWrap>
        {action.icon && <Center>{action.icon}</Center>}

        <div style={{ flex: 1 }}>
          <Text>{action.title}</Text>

          {action.description && (
            <Text color="dimmed" size="xs">
              {action.description}
            </Text>
          )}
        </div>

        {action.new && <Badge>new</Badge>}
      </Group>
    </UnstyledButton>
  );
}
