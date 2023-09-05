import { navigate } from '@/routes';
import { FileJSON, LastVisit, SaveChanges } from '@/types';
import { ExternalStore } from './ExternalStore';
import { debouncePromise } from './debounce';

interface Snapshot {
  files: FileJSON[];
  fileDict: Record<string, FileJSON>;
  lastVisits: (FileJSON & LastVisit)[];
}

export class FileManager extends ExternalStore<Snapshot> {
  protected snapshot: Snapshot = {
    files: [],
    fileDict: {},
    lastVisits: []
  };

  constructor() {
    super();
    this.save = debouncePromise(this.save.bind(this));
  }

  async load() {
    const files = await adapter.getFiles();
    this.snapshot.files = files;
    this.snapshot.fileDict = files.reduce((r, f) => ({ ...r, [f.id]: f }), {} as Record<string, FileJSON>);
    this.snapshot.lastVisits = await adapter.getLastVisits().then(lastVisits => {
      return lastVisits
        .map(l => this.snapshot.fileDict[l.id] && { ...this.snapshot.fileDict[l.id], ...l })
        .filter(Boolean);
    });
    this.emitChange();
  }

  async save(payload: SaveChanges) {
    const file = await adapter.saveChanges(payload);

    if (!payload.id) {
      await navigate('/editor/:title/:id', file);
    }

    this.snapshot = {
      ...this.snapshot,
      files: this.snapshot.files.map(f => (f.id === file.id ? file : f)),
      fileDict: { ...this.snapshot.fileDict, [file.id]: file }
    };
    this.emitChange();

    return file;
  }
}

export const fileManager = new FileManager();
