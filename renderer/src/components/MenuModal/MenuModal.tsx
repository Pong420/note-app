import { Text, Group, Modal, ModalProps, Stack, useMantineTheme } from '@mantine/core';
import { IconMenu2, type TablerIconsProps } from '@tabler/icons-react';
import { getMenuColors } from '@/components/MenuModal/colors';

export interface MenuModalProps extends Omit<ModalProps, 'ref'> {
  icon?: React.ComponentType<TablerIconsProps>;
  onExited?: () => void;
}

export function MenuModal({ title, children, icon: Icon = IconMenu2, onExited, ...props }: MenuModalProps) {
  const theme = useMantineTheme();
  const [primaryColor, secondaryColor] = getMenuColors(theme.colorScheme);

  return (
    <Modal.Root
      radius={6}
      size="sm"
      centered
      withinPortal
      transitionProps={{ ...props.transitionProps, onExited }}
      {...props}
    >
      <Modal.Overlay opacity={0.5} />

      <Modal.Content bg={primaryColor}>
        <Modal.Header bg={secondaryColor} pl="md">
          <Modal.Title>
            <Group gap="xs">
              <Icon size="1.5rem" />
              <Text size="lg" fw={500}>
                {title}
              </Text>
            </Group>
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>

        <Modal.Body p="0">
          <Stack pb="sm" gap={0}>
            {children}
          </Stack>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
