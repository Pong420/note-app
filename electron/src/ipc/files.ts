import fs from 'fs-extra';
import path from 'path';
import fastGlob from 'fast-glob';
import { app } from 'electron';
import { createIpcHandlers } from './ipcCreator';
import { rootDir as projectRootDir } from '../constants';

export interface FileJSON {
  id: string; // unique
  title: string;
  content: Record<string, unknown>;
}

export type SaveChanges = {
  id: string;
  title: string;
  content: Record<string, unknown>;
};

let rootDir = '';
try {
  // userData it is not recommended to write large files here because some environments may backup this directory to cloud storage.
  const appPath = app.getAppPath();
  rootDir = path.join(appPath, appPath === projectRootDir ? '.temp' : 'storage');
} catch {
  //
}

export const filesDir = (...args: string[]) => path.join(rootDir, ...args);

export const files = new Map<string, FileJSON>();

fastGlob.sync(['**/data.json'], { absolute: true, cwd: filesDir() }).forEach(filepath => {
  const file = fs.readJsonSync(filepath, { throws: false }) as FileJSON;
  if (file) {
    files.set(file.id, file);
  }
});

export const filesHandlers = createIpcHandlers({
  getFiles(_event) {
    return Array.from(files, ([, file]) => file);
  },
  getFile(_event, { id }: { id: string }) {
    return files.get(id);
  }
});

export const filesBroadcasts = createIpcHandlers({
  async FileChanged(_event, { id, title, content }: SaveChanges) {
    const filepath = filesDir(id, 'data.json');
    const file: FileJSON = { id, title, content };
    await fs.outputFile(filepath, JSON.stringify(file));
    files.set(file.id, file);
    return file;
  }
});
