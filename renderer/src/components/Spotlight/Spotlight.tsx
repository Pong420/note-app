import { useState, useSyncExternalStore } from 'react';
import { default as Fuse } from 'fuse.js';
import { Spotlight as MantineSpotlight, SpotlightActionData } from '@mantine/spotlight';
import { IconFile, IconSearch } from '@tabler/icons-react';
import { shortcut } from '@/components/Editor/Spotlight';
import { navigate } from '@/routes';
import { fileManager } from '@/utils/FileManager';
import { useFile } from '@/hooks/useFile';
import { SpotlightAction, SpotlightActionProps } from './SpotlightAction';
import { mainActions } from './actions';
import { spotlightStore } from './utils';
import './spotlight.css';

const getFiles = () => fileManager.files;

const mantineShortcut = shortcut.map(s => s.replace(/-/g, ' + '));

const fuse = new Fuse<SpotlightActionProps>([], { keys: ['title', 'keywords'] });
const renderActions = (query: string, actions: SpotlightActionProps[]): JSX.Element[] => {
  query = query.replace(/^(>)/, '');
  if (!query.trim()) return actions.map(a => <SpotlightAction key={a.id} {...a} />);
  fuse.setCollection(actions);
  return fuse.search(query).map(({ item: a }) => <SpotlightAction key={a.id} {...a} />);
};

export function Spotlight() {
  const [query, setQuery] = useState('');
  const file = useFile();
  const files = useSyncExternalStore(fileManager.subscribe, getFiles);
  const actions = query.startsWith('>')
    ? mainActions(spotlightStore, file)
    : files.reduce(
        (actions, f) =>
          file && file.id === f.id
            ? actions
            : [
                ...actions,
                {
                  file,
                  id: f.id,
                  title: f.title,
                  icon: IconFile,
                  description: new Date(f.createdAt).toISOString().replace(/T/, ' ').replace(/\..*/, ''),
                  onClick: () => navigate('/editor/:title/:id', f)
                }
              ],
        [] as SpotlightActionData[]
      );

  return (
    <MantineSpotlight.Root
      store={spotlightStore}
      returnFocus={false}
      shortcut={mantineShortcut}
      query={query}
      onQueryChange={setQuery}
    >
      <MantineSpotlight.Search placeholder="Search..." leftSection={<IconSearch stroke={1.5} />} />
      <MantineSpotlight.ActionsList>
        {actions.length > 0 ? (
          renderActions(query, actions)
        ) : (
          <MantineSpotlight.Empty>Nothing found...</MantineSpotlight.Empty>
        )}
      </MantineSpotlight.ActionsList>
    </MantineSpotlight.Root>
  );
}
