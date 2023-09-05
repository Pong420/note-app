import fs from 'fs-extra';
import { nanoid } from 'nanoid';
import { createIpcHandlers } from './ipcCreator';
import { FileJSON, files, filesDir } from '../files';

export type SaveChanges = {
  id?: string;
  title: string;
  content: Record<string, unknown>;
};

export const filesHandlers = createIpcHandlers({
  async saveChanges(_event, { id = nanoid(), title, content }: SaveChanges) {
    const filepath = filesDir(id, 'data.json');
    const file: FileJSON = { id, title, content };
    await fs.outputFile(filepath, JSON.stringify(file));
    files.set(file.id, file);
    return file;
  },
  getFiles(_event) {
    return Array.from(files, ([, file]) => file);
  },
  getFile(_event, { id }: { id: string }) {
    return files.get(id);
  }
});
