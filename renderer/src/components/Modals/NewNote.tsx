import { Button, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPlus } from '@tabler/icons-react';
import { nanoid } from 'nanoid';
import { Modal, ModalProps, ModalSection } from '@/components/Modal';
import { createModalHandler } from '@/utils/modals';
import { navigate } from '@/routes';

export interface NewNoteProps extends ModalProps {}

const [open, close] = createModalHandler(NewNote);

export function NewNote(props: NewNoteProps) {
  const form = useForm({
    initialValues: {
      title: ''
    }
  });

  const handleSubmit = form.onSubmit(values => {
    navigate('/editor/:title/:id', { title: values.title, id: nanoid() });
    props.onClose();
  });

  return (
    <Modal {...props} onExited={() => form.reset()} icon={IconPlus} title="New Note">
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

NewNote.open = open;
NewNote.close = close;
