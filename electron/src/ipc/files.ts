import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';
import axios from 'axios';
import fastGlob from 'fast-glob';
import { createIpcHandlers } from './ipcCreator';
import { appPath } from '../constants';

export interface FileJSON {
  id: string; // unique
  title: string;
  content?: Record<string, unknown>;
  readOnly?: boolean;
  createdAt: number;
  updatedAt: number;
}

export type SaveChanges = {
  id: string;
  title: string;
  content?: Record<string, unknown>;
};

export type FileID = {
  id: string;
};

export const filesDir = (...args: string[]) => path.join(appPath, ...args);

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
  getFile(_event, { id }: FileID) {
    return files.get(id);
  },
  async uploadImage(_event, { id }: FileID, payload: string | { name: string; buffer: ArrayBufferLike }) {
    const image =
      typeof payload === 'string'
        ? await axios.get<Buffer>(payload, { responseType: 'arraybuffer' }).then(async ({ data: buffer }) => ({
            name: '',
            buffer,
            // file-type is esm module and cannot be resolved in `electron/plugins/removeNodeModulePlugin.ts`
            ext: await import('file-type').then(({ fileTypeFromBuffer }) =>
              fileTypeFromBuffer(buffer).then(r => `.${r?.ext || 'png'}`)
            )
          }))
        : {
            ...path.parse(payload.name),
            buffer: Buffer.from(payload.buffer)
          };

    const hash = crypto.createHash('sha256').update(image.buffer).digest('hex');
    const filename = [image.name, hash, image.ext.replace(/^\./, '')].join('.');
    const filepath = filesDir(id, 'assets', filename);
    await fs.outputFile(filepath, image.buffer);
    return `./static/${id}/assets/${filename}`;
  }
});

export const filesBroadcasts = createIpcHandlers({
  async FileChanged(_event, changes: SaveChanges) {
    const { id } = changes;
    const filepath = filesDir(id, 'data.json');
    const now = Date.now();
    let file = files.get(id);

    if (file) {
      file = { ...file, ...changes, updatedAt: now };
    } else {
      file = { ...changes, createdAt: now, updatedAt: now };
    }
    await fs.outputFile(filepath, JSON.stringify(file, null, 2));
    files.set(file.id, file);
    return file;
  },
  async DeleteFile(_event, { id }: FileID) {
    const file = files.get(id);
    const pathname = filesDir(id);
    if (file) {
      files.delete(id);
      await fs.rm(pathname, { force: true, recursive: true });
    }
    return { id };
  }
});
