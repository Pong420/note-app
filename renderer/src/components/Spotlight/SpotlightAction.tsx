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

export interface SpotlightActionProps extends Omit<ISpotlightActionProps, 'id'>, SpotlightActionData {}

export function SpotlightAction({
  icon: Icon,
  title,
  styles,
  classNames,
  description,
  highlightQuery,
  ...props
}: SpotlightActionProps) {
  return (
    <Spotlight.Action className={classes.action} tabIndex={-1} onMouseDown={event => event.preventDefault()} {...props}>
      <Group wrap="nowrap" w="100%">
        {Icon && <Icon size="1.2rem" />}

        <div style={{ flex: 1 }}>
          <Text>{title}</Text>

          {description && (
            <Text opacity={0.6} size="xs">
              {description}
            </Text>
          )}
        </div>
      </Group>
    </Spotlight.Action>
  );
}
