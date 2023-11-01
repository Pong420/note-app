import fs from 'fs-extra';
import path from 'path';
import { shell } from 'electron';
import { createIpcHandlers } from './ipcCreator';
import { storageDir } from '../constants';
import { deepMerge, DeepPartial } from '../utils/deepMerge';

export type SystemData = typeof initialSystemData;

export const systemDataPath = path.join(storageDir, 'system.json');

const initialSystemData = {};

export async function setSystemData(payload: DeepPartial<SystemData>) {
  systemData = deepMerge(systemData, payload) as SystemData;
  await fs.writeFile(systemDataPath, JSON.stringify(systemData, null, 2));
}

export let systemData = deepMerge(
  initialSystemData,
  (fs.readJSONSync(systemDataPath, { throws: false }) as SystemData) || {}
);

export const systemHandlers = createIpcHandlers({
  async openPath(_event, pathname: string) {
    await shell.openPath(pathname);
  },
  getStorageDir() {
    return storageDir;
  },
  getSystemData(_event) {
    return systemData;
  },
  async setSystemData(_event, payload: DeepPartial<SystemData>) {
    return setSystemData(payload);
  }
});
