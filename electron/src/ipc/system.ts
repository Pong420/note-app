import fs from 'fs-extra';
import path from 'path';
import { shell } from 'electron';
import { createIpcHandlers } from './ipcCreator';
import { FileID } from './files';
import { storageDir } from '../constants';

export interface LastVisit {
  id: string; // file id
  timestamp: number;
}

export interface SystemData {
  lastVisits: LastVisit[];
}

export const systemDataPath = path.join(storageDir, 'system.json');

const defaultValue: SystemData = {
  lastVisits: []
};

const systemData = (fs.readJsonSync(systemDataPath, { throws: false }) as SystemData) || defaultValue;

export const system = new Proxy(systemData, {
  set: (target, prop, newValue) => {
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
    target[prop as keyof typeof target] = newValue;
    fs.outputFileSync(systemDataPath, JSON.stringify(target, null, 2));
    return true;
  }
});

export const systemHandlers = createIpcHandlers({
  getLastVisits() {
    return system.lastVisits;
  },
  getAppPath() {
    return storageDir;
  },
  openAppDir() {
    return shell.openPath(storageDir);
  }
});

export const systemBroadcasts = createIpcHandlers({
  LastVisitUpdated(_event, { id }: FileID) {
    const lastVisits = [{ id, timestamp: Date.now() }, ...system.lastVisits.filter(l => l.id !== id)].slice(0, 5);
    system.lastVisits = lastVisits;
    return lastVisits;
  }
});
