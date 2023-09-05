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

let rootDir = '';
try {
  rootDir = app.getPath('userData');
} catch {
  //
}

export const systemDataPath = path.join(rootDir, 'system.json');

const defaultValue: SystemData = {
  lastVisits: []
};

export const system = new Proxy((fs.readJsonSync(systemDataPath, { throws: false }) as SystemData) || defaultValue, {
  set: (target, prop, newValue) => {
    target[prop as keyof typeof target] = newValue;
    fs.outputFileSync(systemDataPath, JSON.stringify(target, null, 2));
    return true;
  }
});
