/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Editor } from '@tiptap/react';

export function file2Buffer(file: File) {
  return new Promise<ArrayBuffer>(resolve => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const buffer = reader.result;
      resolve(buffer as ArrayBuffer);
    });
    reader.readAsArrayBuffer(file);
  });
}

export async function uploadImage(editor: Editor, payload: string | File) {
  // TODO:
}
