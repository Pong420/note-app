import { FileJSON, LastVisit } from '@/types';
import { ExternalStore } from './ExternalStore';

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

  async load() {
    const files = await adapter.getFiles();
    this.snapshot.files = files;
    this.snapshot.fileDict = files.reduce((r, f) => ({ ...r, [f.id]: f }), {} as Record<string, FileJSON>);
    this.snapshot.lastVisits = await adapter
      .getLastVisits()
      .then(lastVisits =>
        lastVisits.map(l => this.snapshot.fileDict[l.id] && { ...this.snapshot.fileDict[l.id], ...l }).filter(Boolean)
      );
    this.emitChange();
  }
}

export const fileManager = new FileManager();
