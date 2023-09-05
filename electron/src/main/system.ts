/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import fs from 'fs-extra';
import path from 'path';
import { app } from 'electron';

export interface LastVisit {
  id: string; // file id
  timestamp: number;
}

export interface SystemData {
  lastVisits: LastVisit[];
}

let appPath = '';
try {
  appPath = app.getAppPath();
} catch {
  //
}

export const systemDataPath = path.join(appPath, 'system.json');
const defaultValue: SystemData = {
  lastVisits: []
};

export const system = new Proxy((fs.readJsonSync(systemDataPath, { throws: false }) as SystemData) || defaultValue, {
  set: (target, prop, newValue) => {
    target[prop as keyof typeof target] = newValue;
    fs.writeFileSync(systemDataPath, JSON.stringify(defaultValue, null, 2));
    return true;
  }
});
