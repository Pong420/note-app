import { IconAdjustmentsHorizontal, IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { NewNote } from '@/components/Modals/NewNote';
import { EditNote } from '@/components/Modals/EditNote';
import { DeleteNote } from '@/components/Modals/DeleteNote';
import { FileJSON } from '@/types';
import { navigate } from '@/routes';
import { SpotlightActionProps } from './SpotlightAction';

export const mainActions = (file?: FileJSON) =>
  [
    {
      id: 'preferences',
      title: 'Preferences',
      icon: IconAdjustmentsHorizontal,
      onClick: () => navigate('/preferences')
    },
    {
      id: 'new-note',
      title: 'New Note',
      icon: IconPlus,
      onClick: () => NewNote.open()
    },
    {
      id: 'edit-note',
      title: 'Edit Note',
      icon: IconEdit,
      onClick: () => file && EditNote.open({ file })
    },
    {
      id: 'delete-note',
      title: 'Delete Note',
      icon: IconTrash,
      onClick: () => file && DeleteNote.open({ file })
    }
  ] satisfies SpotlightActionProps[];
