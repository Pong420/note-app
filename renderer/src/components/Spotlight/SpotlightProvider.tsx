import { useState, useSyncExternalStore } from 'react';
import { useParams } from 'react-router-dom';
import { default as Fuse } from 'fuse.js';
import { SpotlightProvider as MantineSpotlightProvider, SpotlightAction as ISpotlightAction } from '@mantine/spotlight';
import { IconFile, IconSearch } from '@tabler/icons-react';
import { shortcut } from '@/components/Editor/Spotlight';
import { navigate } from '@/routes';
import { fileManager } from '@/utils/FileManager';
import { SpotlightAction, SpotlightActionSchema, SpotlightFileAction } from './SpotlightAction';
import { mainActions } from './actions';

const getFiles = () => fileManager.files;

const mantineShortcut = shortcut.map(s => s.replace(/-/g, ' + '));

const fuse = new Fuse<ISpotlightAction>([], { keys: ['title', 'keywords'] });
const filter = (query: string, actions: ISpotlightAction[]) => {
  query = query.replace(/^(>)/, '');
  if (!query.trim()) return actions;
  fuse.setCollection(actions);
  return fuse.search(query).map(i => i.item);
};

export function SpotlightProvider({ children }: React.PropsWithChildren) {
  const { id } = useParams() as { id: string };
  const [query, setQuery] = useState('');
  const files = useSyncExternalStore(fileManager.subscribe, getFiles);
  const file = fileManager.getFile(id);
  const actions: SpotlightActionSchema[] = query.startsWith('>')
    ? mainActions(file)
    : files.reduce(
        (actions, file) =>
          file.id === id
            ? actions
            : [
                ...actions,
                {
                  file,
                  id: file.id,
                  title: file.title,
                  icon: <IconFile />,
                  // TODO: dayjs
                  description: new Date(file.createdAt).toISOString(),
                  onTrigger: () => navigate('/editor/:title/:id', file)
                }
              ],
        [] as SpotlightFileAction[]
      );

  return (
    <MantineSpotlightProvider
      actions={actions}
      query={query}
      returnFocus={false}
      shortcut={mantineShortcut}
      actionComponent={SpotlightAction}
      filter={filter}
      onQueryChange={setQuery}
      searchIcon={<IconSearch size="1.2rem" />}
      searchPlaceholder="Search..."
      nothingFoundMessage="Nothing found..."
    >
      {children}
    </MantineSpotlightProvider>
  );
}
