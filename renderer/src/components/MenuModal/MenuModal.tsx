import { Text, Group, Modal, ModalProps, Stack } from '@mantine/core';
import { IconMenu2, type TablerIconsProps } from '@tabler/icons-react';
import './MenuModal.css';

export interface MenuModalProps extends Omit<ModalProps, 'ref'> {
  icon?: React.ComponentType<TablerIconsProps>;
}

export function MenuModal({ title, children, icon: Icon = IconMenu2, ...props }: MenuModalProps) {
  return (
    <Modal.Root radius={6} size="sm" centered withinPortal {...props}>
      <Modal.Overlay opacity={0.5} />

      <Modal.Content bg="var(--menu-color)">
        <Modal.Header bg="var(--menu-background-color)" pl="md">
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
