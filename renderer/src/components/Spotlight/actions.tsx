import { IconAdjustmentsHorizontal, IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
// import { NewNote } from '@/components/Modals/NewNote';
// import { EditNote } from '@/components/Modals/EditNote';
// import { DeleteNote } from '@/components/Modals/DeleteNote';
// import { FileJSON } from '@/types';
// import { navigate } from '@/routes';
import { SpotlightActionData } from './SpotlightAction';

export const mainActions = () =>
  [
    {
      id: 'preferences',
      title: 'Preferences',
      icon: IconAdjustmentsHorizontal
      // onTrigger: () => navigate('/preferences')
    },
    {
      id: 'new-note',
      title: 'New Note',
      icon: IconPlus
      // onTrigger: () => NewNote.open()
    },
    {
      id: 'edit-note',
      title: 'Edit Note',
      icon: IconEdit
      // onTrigger: () => file && EditNote.open({ file })
    },
    {
      id: 'delete-note',
      title: 'Delete Note',
      icon: IconTrash
      // onTrigger: () => file && DeleteNote.open({ file })
    }
  ] satisfies SpotlightActionData[];
