import fs from 'fs-extra';
import path from 'path';
import fastGlob from 'fast-glob';
import { app } from 'electron';
import { rootDir as projectRootDir } from './constants';

export interface FileJSON {
  id: string; // unique
  title: string;
  content: Record<string, unknown>;
}

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
