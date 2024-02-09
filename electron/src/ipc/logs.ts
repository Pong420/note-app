import fs from 'fs-extra';
import path from 'node:path';
import { app, dialog, shell } from 'electron';
import { createR2MIpc } from './_ipc';
import { logsDir } from '../constants';

export async function saveLog(error: unknown) {
  try {
    const ISOString = new Date().toISOString();
    const date = ISOString.split('T')[0];
    const filepath = path.join(logsDir, `${date}.txt`);
    const content = await fs.readFile(filepath, 'utf-8').catch(() => '');
    const logs: unknown[] = [];
    if (error instanceof Error) {
      logs.push(error.message, error.stack);
    } else {
      logs.push(error);
    }
    await fs.writeFile(filepath, `${ISOString.replace(/T/, ' ').replace(/Z/, '')}\n${logs.join('\n')}\n\n${content}`);
  } catch (error) {
    console.error(error);
  }
}

export const logsR2MIpc = createR2MIpc({
  openLogsDir(_event) {
    return shell.openPath(logsDir);
  },
  async getLog(_event, filename?: string) {
    if (!filename) {
      [filename] = await fs.readdir(logsDir);
    }
    if (!filename) return '';
    return fs.readFile(path.join(logsDir, filename), 'utf-8');
  },
  async deleteLogs(_event) {
    await fs.rm(logsDir, { recursive: true });
    await fs.mkdir(logsDir, { recursive: true });
  },
  async downloadLog(_event, filename?: string) {
    if (!filename) {
      [filename] = await fs.readdir(logsDir);
    }
    if (!filename) return;
    const outDir = await dialog.showOpenDialog({
      defaultPath: app.getPath('downloads'),
      properties: ['openDirectory']
    });
    if (outDir.canceled) return { canceled: true };
    await fs.copy(path.join(logsDir, filename), path.join(outDir.filePaths[0], filename), { overwrite: true });
  }
});
