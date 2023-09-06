import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { NewNote } from '@/components/Modals/NewNote';
import { EditNote } from '@/components/Modals/EditNote';
import { DeleteNote } from '@/components/Modals/DeleteNote';
import { FileJSON } from '@/types';
import { SpotlightActionSchema } from './SpotlightAction';

export const mainActions = (file?: FileJSON) =>
  [
    {
      type: 'action',
      id: 'new-note',
      title: 'New Note',
      icon: <IconPlus size="1.2rem" />,
      onTrigger: () => NewNote.open()
    },
    {
      type: 'action',
      id: 'edit-note',
      title: 'Edit Note',
      icon: <IconEdit size="1.2rem" />,
      onTrigger: () => file && EditNote.open({ file })
    },
    {
      type: 'action',
      id: 'delete-note',
      title: 'Delete Note',
      icon: <IconTrash size="1.2rem" />,
      onTrigger: () => file && DeleteNote.open({ file })
    }
  ] satisfies SpotlightActionSchema[];
