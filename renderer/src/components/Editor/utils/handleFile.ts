/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Editor } from '@tiptap/react';
import { FileID } from '@/types';

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

export async function setImage(editor: Editor, id: FileID, payload: string | File) {
  let src = '';

  if (typeof payload === 'string') {
    src = await adapter.uploadAsset(id, payload);
  } else {
    const buffer = await file2Buffer(payload);
    src = await adapter.uploadAsset(id, { name: payload.name, buffer });
  }

  const image = new Image();
  image.src = src;
  image.onload = () => {
    const size = { width: image.naturalWidth, height: image.naturalHeight };
    editor.commands.setImage({ ...size, src, ratio: size.width / size.height });
  };
}
