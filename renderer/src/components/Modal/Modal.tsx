import { Text, Group, Modal as MantineModal, ModalProps as MantineModalProps, ModalBaseBodyProps } from '@mantine/core';
import { IconMenu2, type TablerIconsProps } from '@tabler/icons-react';
import './Modal.css';

export interface ModalProps extends Omit<MantineModalProps, 'ref'> {
  icon?: React.ComponentType<TablerIconsProps> | null;
  title?: React.ReactNode;
  bodyProps?: ModalBaseBodyProps;
  onExited?: () => void;
}

export function Modal({ title, children, icon: Icon = IconMenu2, onExited, bodyProps, ...props }: ModalProps) {
  return (
    <MantineModal.Root
      radius={6}
      size="sm"
      centered
      withinPortal
      {...props}
      transitionProps={{
        ...props.transitionProps,
        onExited: () => {
          props.transitionProps?.onExited?.();
          onExited?.();
        }
      }}
    >
      <MantineModal.Overlay opacity={0.5} />

      <MantineModal.Content bg="var(--menu-color)">
        <MantineModal.Header bg="var(--menu-background-color)" py="sm">
          <MantineModal.Title>
            <Group gap="xs">
              {Icon && <Icon size="1.3rem" />}
              {typeof title === 'string' ? (
                <Text size="md" fw={500}>
                  {title}
                </Text>
              ) : (
                title
              )}
            </Group>
          </MantineModal.Title>
          <MantineModal.CloseButton />
        </MantineModal.Header>

        <MantineModal.Body {...bodyProps}>{children}</MantineModal.Body>
      </MantineModal.Content>
    </MantineModal.Root>
  );
}
