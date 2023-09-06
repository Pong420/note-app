import { Button, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconEdit } from '@tabler/icons-react';
import { MenuModal, MenuModalProps, MenuModalSection } from '@/components/MenuModal';
import { createModalHandler } from '@/utils/modals';
import { FileJSON } from '@/types';

export interface EditNoteProps extends MenuModalProps {
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
    <MenuModal {...props} onExited={() => form.reset()} icon={IconEdit} title="Edit Note">
      <MenuModalSection>
        <form onSubmit={handleSubmit}>
          <Stack mx="md">
            <TextInput data-autofocus label="Title" {...form.getInputProps('title')} />
            <Button type="submit">Conform</Button>
          </Stack>
        </form>
      </MenuModalSection>
    </MenuModal>
  );
}

EditNote.open = open;
EditNote.close = close;
