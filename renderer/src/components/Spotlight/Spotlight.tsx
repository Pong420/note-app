import { useState, useSyncExternalStore } from 'react';
import { useParams } from 'react-router-dom';
// import { default as Fuse } from 'fuse.js';
import { Spotlight as MantineSpotlight, SpotlightActionData } from '@mantine/spotlight';
import { IconFile, IconSearch } from '@tabler/icons-react';
import { shortcut } from '@/components/Editor/Spotlight';
// import { navigate } from '@/routes';
import { FileID } from '@/types';
import { fileManager } from '@/utils/FileManager';
import { SpotlightAction } from './SpotlightAction';
import { mainActions } from './actions';

const getFiles = () => fileManager.files;

const mantineShortcut = shortcut.map(s => s.replace(/-/g, ' + '));

// const fuse = new Fuse<SpotlightActionProps>([], { keys: ['title', 'keywords'] });
// const filter = (query: string, actions: SpotlightActionProps[]) => {
//   query = query.replace(/^(>)/, '');
//   if (!query.trim()) return actions;
//   fuse.setCollection(actions);
//   return fuse.search(query).map(i => i.item);
// };

export function Spotlight() {
  const { id } = useParams() as FileID;
  const [query, setQuery] = useState('');
  const files = useSyncExternalStore(fileManager.subscribe, getFiles);
  const file = fileManager.getFile(id);
  const actions = query.startsWith('>')
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
                  icon: IconFile,
                  // TODO: dayjs
                  description: new Date(file.createdAt).toISOString()
                }
              ],
        [] as SpotlightActionData[]
      );

  return (
    <MantineSpotlight.Root returnFocus={false} shortcut={mantineShortcut} query={query} onQueryChange={setQuery}>
      <MantineSpotlight.Search placeholder="Search..." leftSection={<IconSearch stroke={1.5} />} />
      <MantineSpotlight.ActionsList>
        {actions.length > 0 ? (
          actions.map(data => <SpotlightAction key={data.id} {...data} />)
        ) : (
          <MantineSpotlight.Empty>Nothing found...</MantineSpotlight.Empty>
        )}
      </MantineSpotlight.ActionsList>
    </MantineSpotlight.Root>
  );
}
