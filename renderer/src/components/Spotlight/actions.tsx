import { SpotlightStore } from '@mantine/spotlight';
import { IconAdjustmentsHorizontal, IconEdit, IconFileTypePdf, IconPlus, IconTrash } from '@tabler/icons-react';
import { NewNote } from '@/components/Modals/NewNote';
import { EditNote } from '@/components/Modals/EditNote';
import { DeleteNote } from '@/components/Modals/DeleteNote';
import { FileJSON } from '@/types';
import { navigate } from '@/routes';
import { SpotlightActionProps } from './SpotlightAction';

export const mainActions = (_store: SpotlightStore, file?: FileJSON) => {
  const actions: (SpotlightActionProps | false | undefined)[] = [
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
    file && {
      id: 'edit-note',
      title: 'Edit Note',
      icon: IconEdit,
      onClick: () => EditNote.open({ file })
    },
    file && {
      id: 'delete-note',
      title: 'Delete Note',
      icon: IconTrash,
      onClick: () => DeleteNote.open({ file })
    },
    file && {
      id: 'export-pdf',
      title: 'Export as PDF',
      icon: IconFileTypePdf,
      onClick: () => {
        adapter.exportPDF({ id: file.id });
      }
    }
  ];

  return actions.filter((a): a is SpotlightActionProps => !!a);
};
