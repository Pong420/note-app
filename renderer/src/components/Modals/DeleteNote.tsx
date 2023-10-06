import { useState } from 'react';
import { Button, Stack, Text, TextInput } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { MenuModal, MenuModalProps, MenuModalSection } from '@/components/MenuModal';
import { createModalHandler } from '@/utils/modals';
import { navigate } from '@/routes';
import { FileJSON } from '@/types';

export interface DeleteNoteProps extends MenuModalProps {
  file: FileJSON;
}

const keyword = `Delete`;

const [open, close] = createModalHandler(DeleteNote);

export function DeleteNote({ file, ...props }: DeleteNoteProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    adapter.emitDeleteFile({ id: file.id });
    navigate('/editor/new-page');
    props.onClose();
  };

  return (
    <MenuModal {...props} onExited={() => setInput('')} icon={IconTrash} title="Delete Note">
      <MenuModalSection>
        <form onSubmit={handleSubmit}>
          <Stack mx="md" gap="md">
            <Text size="md">
              This will permanently delete the note <b> {file.title}</b>. To confirm, type "{keyword}" in the box below
            </Text>

            <TextInput
              data-autofocus
              placeholder={keyword}
              value={input}
              onChange={event => setInput(event.target.value)}
              error={input && input !== keyword}
            />

            <Button type="submit" color="red" disabled={input !== keyword}>
              Conform
            </Button>
          </Stack>
        </form>
      </MenuModalSection>
    </MenuModal>
  );
}

DeleteNote.open = open;
DeleteNote.close = close;
