import { FileJSON, LastVisit } from '@/types';
import { ExternalStore } from './ExternalStore';

interface Snapshot {
  // TODO: refactor, use Map instead of list & dict
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

    // TODO: try typescript disposed later
    adapter.subscribeFileChanged(this.handleFileChanged);
    adapter.subscribeDeleteFile(this.handleDeleteFile);
    adapter.subscribeLastVisitUpdated(this.handleLastVisitUpdated);
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
    return true;
  }

  get files() {
    return this.snapshot.files;
  }

  get fileDict() {
    return this.snapshot.fileDict;
  }

  get lastVisits() {
    return this.snapshot.lastVisits;
  }

  getFile(id: string): FileJSON | undefined {
    return this.snapshot.fileDict[id];
  }

  handleFileChanged = (file: FileJSON) => {
    const exists = !!this.snapshot.fileDict[file.id];
    this.snapshot = {
      ...this.snapshot,
      files: exists ? this.snapshot.files.map(f => (f.id === file.id ? file : f)) : [file, ...this.snapshot.files],
      fileDict: { ...this.snapshot.fileDict, [file.id]: file }
    };
    this.emitChange();
  };

  handleDeleteFile = (file: Pick<FileJSON, 'id'>) => {
    const { [file.id]: deleted, ...fileDict } = this.snapshot.fileDict;
    this.snapshot = {
      ...this.snapshot,
      files: this.snapshot.files.filter(f => f.id !== file.id),
      fileDict
    };
    this.emitChange();
  };

  handleLastVisitUpdated = (lastVisits: LastVisit[]) => {
    this.snapshot = {
      ...this.snapshot,
      lastVisits: lastVisits
        .map(l => this.snapshot.fileDict[l.id] && { ...this.snapshot.fileDict[l.id], ...l })
        .filter(Boolean)
    };
    this.emitChange();
  };
}

export const fileManager = new FileManager();
