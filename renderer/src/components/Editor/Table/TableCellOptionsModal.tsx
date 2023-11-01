import { Button, ColorInput, ModalProps, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconTableOptions } from '@tabler/icons-react';
import { Modal, ModalSection, ModalRow } from '@/components/Modal';
import { createModalHandler } from '@/utils/modals';
import { tableCellAttributes } from './TableCell';

export interface TableCellOptionsModalProps extends ModalProps {
  initialValues?: Record<string, unknown>;
  onConfirm?: (values: Record<string, unknown>) => void;
}

const inputWidth = 170;

const [open, close] = createModalHandler(TableCellOptionsModal);

export function TableCellOptionsModal({ initialValues = {}, onConfirm, ...props }: TableCellOptionsModalProps) {
  const form = useForm({
    initialValues: {
      ...tableCellAttributes,
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
    <Modal {...props} icon={IconTableOptions} title="Table Cell Options">
      <form onSubmit={handleSubmit}>
        <ModalSection>
          <ModalRow title="Width">
            <TextInput w={inputWidth} type="number" {...getInputProps('width')} />
          </ModalRow>

          <ModalRow title="Height">
            <TextInput w={inputWidth} type="number" {...getInputProps('height')} />
          </ModalRow>

          <ModalRow title="Background Color">
            <ColorInput w={inputWidth} {...getInputProps('bgcolor')} />
          </ModalRow>

          <ModalRow title="Horizontal Align">
            <Select
              w={inputWidth}
              withCheckIcon={false}
              allowDeselect
              data={[
                { label: 'None', value: '' },
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'right' }
              ]}
              {...getInputProps('align')}
            />
          </ModalRow>

          <ModalRow title="Vertical Align">
            <Select
              w={inputWidth}
              withCheckIcon={false}
              allowDeselect
              data={[
                { label: 'None', value: '' },
                { label: 'Top', value: 'top' },
                { label: 'Middle', value: 'middle' },
                { label: 'Bottom', value: 'bottom' }
              ]}
              {...getInputProps('valign')}
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

TableCellOptionsModal.open = open;
TableCellOptionsModal.close = close;
