import { useState } from 'react';
import { Button, Stack, Text, TextInput } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { Modal, ModalProps, ModalSection } from '@/components/Modal';
import { createModalHandler } from '@/utils/modals';
import { FileJSON } from '@/types';
import { navigate } from '@/routes';

export interface DeleteNoteProps extends ModalProps {
  file: FileJSON;
}

const keyword = `Delete`;

const [open, close] = createModalHandler(DeleteNote);

export function DeleteNote({ file, ...props }: DeleteNoteProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    adapter.emitDeleteFile({ id: file.id });
    navigate('/');
    props.onClose();
  };

  return (
    <Modal {...props} onExited={() => setInput('')} icon={IconTrash} title="Delete Note">
      <ModalSection>
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
      </ModalSection>
    </Modal>
  );
}

DeleteNote.open = open;
DeleteNote.close = close;
