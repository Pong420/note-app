import { Group, Text } from '@mantine/core';
import {
  Spotlight,
  SpotlightActionData as ISpotlightActionData,
  SpotlightActionProps as ISpotlightActionProps
} from '@mantine/spotlight';
import { TablerIconsProps } from '@tabler/icons-react';
import { FileJSON } from '@/types';
import classes from './SpotlightAction.module.css';

export interface SpotlightActionData extends ISpotlightActionData {
  icon?: React.ComponentType<TablerIconsProps>;
  file?: FileJSON;
}

export interface SpotlightActionProps extends ISpotlightActionProps {
  icon?: React.ComponentType<TablerIconsProps>;
}

export function SpotlightAction({
  icon: Icon,
  title,
  styles,
  classNames,
  description,
  highlightQuery,
  ...others
}: SpotlightActionProps) {
  return (
    <Spotlight.Action
      className={classes.action}
      tabIndex={-1}
      onMouseDown={event => event.preventDefault()}
      {...others}
    >
      <Group wrap="nowrap" w="100%">
        {/* {action.icon && <Center>{action.icon}</Center>} */}
        {Icon && <Icon size="1.2rem" />}

        <div style={{ flex: 1 }}>
          <Text>{title}</Text>

          {description && (
            <Text c="dimmed" size="xs">
              {description}
            </Text>
          )}
        </div>
      </Group>
    </Spotlight.Action>
  );
}
