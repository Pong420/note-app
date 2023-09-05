import fs from 'fs-extra';
import path from 'path';
import fastGlob from 'fast-glob';
import { app } from 'electron';

export interface FileJSON {
  id: string; // unique
  title: string;
  content: Record<string, unknown>;
}

let appPath = '';
try {
  appPath = app.getAppPath();
} catch {
  //
}
export const filesDir = (...args: string[]) => path.join(appPath, 'files', ...args);

export const files = new Map<string, FileJSON>();

fastGlob.sync(['**/data.json'], { absolute: true, cwd: filesDir() }).forEach(filepath => {
  const file = fs.readJsonSync(filepath, { throws: false }) as FileJSON;
  if (file) {
    files.set(file.id, file);
  }
});
