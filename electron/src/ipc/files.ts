import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';
import axios from 'axios';
import fastGlob from 'fast-glob';
import { BrowserWindow, app, dialog, shell } from 'electron';
import { PDFDocument } from 'pdf-lib';
import { createR2MIpc, createR2RIpc } from './_ipc';
import { filesRootDir } from '../constants';

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

export interface ExportPDFOptions extends FileID {}

export const filesDir = (...args: string[]) => path.join(filesRootDir, ...args);

export const files = new Map<string, FileJSON>();

fastGlob.sync(['**/data.json'], { absolute: true, cwd: filesDir() }).forEach(filepath => {
  const file = fs.readJsonSync(filepath, { throws: false }) as FileJSON;
  if (file) {
    files.set(file.id, file);
  }
});

export const filesR2MIpc = createR2MIpc({
  getFiles(_event) {
    return Array.from(files, ([, file]) => file);
  },
  getFile(_event, { id }: FileID) {
    return files.get(id);
  },
  async uploadAsset(_event, { id }: FileID, payload: string | { name: string; buffer: ArrayBufferLike }) {
    const image =
      typeof payload === 'string'
        ? await axios.get<Buffer>(payload, { responseType: 'arraybuffer' }).then(async ({ data: buffer }) => ({
            name: '',
            buffer,
            // file-type is esm module and cannot be resolved in `electron/plugins/removeNodeModulePlugin.ts`
            ext: await import('file-type').then(({ fileTypeFromBuffer }) =>
              fileTypeFromBuffer(buffer).then(r => (r?.ext ? `.${r?.ext}` : ''))
            )
          }))
        : {
            ...path.parse(payload.name),
            buffer: Buffer.from(payload.buffer)
          };

    const hash = crypto.createHash('sha256').update(image.buffer).digest('hex');
    const filename = [hash, image.ext.replace(/^\./, '')].join('.');

    const filepath = filesDir(id, 'assets', filename);
    await fs.outputFile(filepath, image.buffer);

    return `./static/${id}/assets/${filename}`;
  },
  async exportPDF(event, { id }: ExportPDFOptions) {
    const file = files.get(id);
    if (!file) throw new Error(`export pdf error, file ${id} is not defined`);

    const win = BrowserWindow.fromWebContents(event.sender);
    const buffer = await win?.webContents.printToPDF({
      printBackground: true,
      preferCSSPageSize: false,
      pageSize: 'Tabloid',
      margins: { top: 0, left: 0, right: 0, bottom: 0 }
    });

    if (buffer) {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();

      let totalHeight = 0;
      const srcDoc = await PDFDocument.load(buffer);
      const pages = srcDoc.getPages().slice().reverse();

      for (const p of pages) {
        const embedPage = await pdfDoc.embedPage(p);
        const width = p.getWidth();
        const height = embedPage.height;

        page.drawPage(embedPage, { x: 0, y: totalHeight, width, height });

        totalHeight += height;
        page.setWidth(Math.max(width, page.getWidth()));
        page.setHeight(totalHeight);
      }

      // Save the PDF to a file
      const pdfBytes = await pdfDoc.save();

      const outFile = await dialog.showSaveDialog({
        defaultPath: path.join(app.getPath('downloads'), `${file.title}.pdf`),
        properties: ['dontAddToRecent', 'showOverwriteConfirmation']
      });

      if (!outFile.canceled && outFile.filePath) {
        await fs.outputFile(outFile.filePath, pdfBytes);
      }
    }
  }
});

export const filesR2RIpc = createR2RIpc({
  async fileChanged(_event, changes: SaveChanges) {
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
  async deleteFile(_event, { id }: FileID) {
    const file = files.get(id);
    const pathname = filesDir(id);
    if (file) {
      files.delete(id);
      await shell.trashItem(pathname);
    }
    return { id };
  }
});
