import { Button, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPlus } from '@tabler/icons-react';
import { MenuModal, MenuModalProps, MenuModalSection } from '@/components/MenuModal';
import { createModalHandler } from '@/utils/modals';
import { navigate } from '@/routes';

export interface NewNoteProps extends MenuModalProps {}

const [open, close] = createModalHandler(NewNote);

export function NewNote(props: NewNoteProps) {
  const form = useForm({
    initialValues: {
      title: ''
    }
  });

  const handleSubmit = form.onSubmit(values => {
    navigate('/editor/new-page/:title', { title: values.title });
    props.onClose();
  });

  return (
    <MenuModal {...props} onExited={() => form.reset()} icon={IconPlus} title="New Note">
      <MenuModalSection>
        <form onSubmit={handleSubmit}>
          <Stack mx="md" gap="md">
            <TextInput data-autofocus label="Title" {...form.getInputProps('title')} />
            <Button type="submit">Conform</Button>
          </Stack>
        </form>
      </MenuModalSection>
    </MenuModal>
  );
}

NewNote.open = open;
NewNote.close = close;
