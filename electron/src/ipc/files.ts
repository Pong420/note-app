import fs from 'fs-extra';
import crypto from 'crypto';
import { createIpcHandlers } from './ipcCreator';
import { FileJSON, files, filesDir } from '../main/files';

export type SaveChanges = {
  id?: string;
  title: string;
  content: Record<string, unknown>;
};

export const filesHandlers = createIpcHandlers({
  async saveChanges(_event, { id = crypto.randomUUID(), title, content }: SaveChanges) {
    const filepath = filesDir(title, id, 'data.json');
    const data: FileJSON = { id, title, content };
    await fs.outputFile(filepath, JSON.stringify(data));
  },
  getFiles(_event) {
    return Array.from(files, ([, file]) => file);
  },
  getFile(_event, { id }: { id: string }) {
    return files.get(id);
  }
});
