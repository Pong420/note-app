import { Button, ColorInput, ModalProps, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconTableOptions } from '@tabler/icons-react';
import { Modal, ModalSection, ModalRow } from '@/components/Modal';
import { createModalHandler } from '@/utils/modals';
import { tableAttributes } from './Table';

export interface TableOptionsModalProps extends ModalProps {
  initialValues?: Record<string, unknown>;
  onConfirm?: (values: Record<string, unknown>) => void;
}

const inputWidth = 170;

const [open, close] = createModalHandler(TableOptionsModal);

export function TableOptionsModal({ initialValues = {}, onConfirm, ...props }: TableOptionsModalProps) {
  const form = useForm({
    initialValues: {
      ...tableAttributes,
      ...initialValues
    }
  });

  const handleSubmit = form.onSubmit(values => {
    onConfirm?.(Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v === '' ? undefined : v])));
    props.onClose();
  });

  const getInputProps: (typeof form)['getInputProps'] = (...args) => {
    const props = form.getInputProps(...args);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return { ...props, value: props.value === null || props.value === undefined ? '' : props.value };
  };

  return (
    <Modal {...props} icon={IconTableOptions} title="Table Options">
      <form onSubmit={handleSubmit}>
        <ModalSection>
          <ModalRow title="Width">
            <TextInput w={inputWidth} type="number" {...getInputProps('width')} />
          </ModalRow>

          <ModalRow title="Height">
            <TextInput w={inputWidth} type="number" {...getInputProps('height')} />
          </ModalRow>

          <ModalRow title="Border">
            <TextInput w={inputWidth} type="number" {...getInputProps('border')} />
          </ModalRow>

          <ModalRow title="Border Color">
            <ColorInput w={inputWidth} {...getInputProps('bordercolor')} />
          </ModalRow>

          <ModalRow title="Padding">
            <TextInput w={inputWidth} type="number" {...getInputProps('padding')} />
          </ModalRow>

          <ModalRow title="Condition">
            <Select
              {...getInputProps('condition')}
              w={inputWidth}
              withCheckIcon={false}
              allowDeselect
              data={[
                { label: 'None', value: '' },
                { label: 'Enable Super Tie', value: 'enableSuperTie' },
                { label: 'Disable Super Tie', value: 'disableSuperTie' }
              ]}
            />
          </ModalRow>
        </ModalSection>

        <ModalSection>
          <Button size="xs" type="submit">
            Confirm
          </Button>
        </ModalSection>
      </form>
    </Modal>
  );
}

TableOptionsModal.open = open;
TableOptionsModal.close = close;
