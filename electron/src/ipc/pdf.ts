import fs from 'node:fs/promises';
import path from 'node:path';
import { BrowserWindow } from 'electron';
import { createIpcHandlers } from './ipcCreator';
import { electronDir } from '../constants';

export const pdfHandlers = createIpcHandlers({
  async exportPDF(event) {
    const win = BrowserWindow.fromWebContents(event.sender);
    const buffer = await win?.webContents.printToPDF({
      printBackground: true,
      preferCSSPageSize: true,
      pageSize: 'Letter',
      margins: { top: 0, left: 0, right: 0, bottom: 0 }
    });
    if (buffer) {
      await fs.writeFile(path.join(electronDir, 'test.pdf'), buffer);
    }
  }
});
