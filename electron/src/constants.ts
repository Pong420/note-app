import fs from 'node:fs';
import path from 'node:path';
import { app } from 'electron';

export const electronDir = path.join(__dirname);
export const rootDir = path.join(electronDir, '..');
export const rendererDir = path.join(rootDir, 'build');

export let storageDir = '';
export let filesRootDir = '';
export let logsDir = '';

try {
  // userData it is not recommended to write large files here because some environments may backup this directory to cloud storage.
  storageDir = process.env.NODE_ENV === 'production' ? path.join(app.getPath('appData'), APP_ID) : app.getAppPath();
  storageDir = path.join(storageDir, 'storage');

  filesRootDir = path.join(storageDir, 'files');
  fs.mkdirSync(filesRootDir, { recursive: true });

  logsDir = path.join(storageDir, 'logs');
  fs.mkdirSync(logsDir, { recursive: true });
} catch {
  //
}
