import { FileJSON } from '@/types';
import { ExternalStore } from './ExternalStore';

interface Snapshot {
  // TODO: refactor, use Map instead of list & dict
  files: FileJSON[];
  fileDict: Record<string, FileJSON>;
}

export class FileManager extends ExternalStore<Snapshot> {
  protected snapshot: Snapshot = {
    files: [],
    fileDict: {}
  };

  constructor() {
    super();

    // TODO: try typescript disposed later
    adapter.onFileChanged(this.handleFileChanged);
    adapter.onDeleteFile(this.handleDeleteFile);
  }

  async load() {
    const files = await adapter.getFiles();
    this.snapshot.files = files;
    this.snapshot.fileDict = files.reduce((r, f) => ({ ...r, [f.id]: f }), {} as Record<string, FileJSON>);
    this.emitChange();
    return true;
  }

  get files() {
    return this.snapshot.files;
  }

  get fileDict() {
    return this.snapshot.fileDict;
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
}

export const fileManager = new FileManager();
