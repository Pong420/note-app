import { Button, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconEdit } from '@tabler/icons-react';
import { Modal, ModalProps, ModalSection } from '@/components/Modal';
import { createModalHandler } from '@/utils/modals';
import { FileJSON } from '@/types';

export interface EditNoteProps extends ModalProps {
  file: FileJSON;
}

const [open, close] = createModalHandler(EditNote);

export function EditNote({ file, ...props }: EditNoteProps) {
  const form = useForm({
    initialValues: file || { title: '' }
  });

  const handleSubmit = form.onSubmit(values => {
    adapter.emitFileChanged({ ...file, ...values });
    props.onClose();
  });

  return (
    <Modal {...props} onExited={() => form.reset()} icon={IconEdit} title="Edit Note">
      <ModalSection>
        <form onSubmit={handleSubmit}>
          <Stack mx="md" gap="md">
            <TextInput data-autofocus label="Title" {...form.getInputProps('title')} />
            <Button type="submit">Conform</Button>
          </Stack>
        </form>
      </ModalSection>
    </Modal>
  );
}

EditNote.open = open;
EditNote.close = close;
