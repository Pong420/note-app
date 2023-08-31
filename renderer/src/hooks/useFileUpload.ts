import { useEffect, useMemo, useRef, useState } from 'react';

export interface CreateInputOptions {
  accept?: string;
}

export interface FileUploadOptions extends CreateInputOptions {}

type Listener = (files: File[]) => void;

const isFile = (p: unknown): p is File => !!p && typeof p === 'object' && p instanceof File;

export function getFilesFromEvent(event: Event) {
  let list: DataTransferItemList | FileList | null;
  const files: File[] = [];

  switch (event.type) {
    case 'drag':
    case 'dragover':
    case 'drop': {
      const { dataTransfer } = event as DragEvent | React.DragEvent;
      list = dataTransfer?.items || dataTransfer?.files || null;
      break;
    }
    case 'input':
    case 'change': {
      const currentTarget = event.currentTarget as HTMLInputElement;
      list = currentTarget.files;
      break;
    }
    default:
      throw new Error(`cannot get files from event ${event.type}`);
  }

  if (list) {
    for (let i = 0; i < list?.length; i++) {
      const f = list[i];
      if (!f) continue;
      if (isFile(f)) files.push(f);
      else {
        const file = f.getAsFile();
        file && files.push(file);
      }
    }
  }

  return files;
}

export function useFileUpload({ accept }: FileUploadOptions = {}) {
  const [listeners] = useState(new Set<Listener>());
  const inputRef = useRef(document.createElement('input'));

  const actions = useMemo(() => {
    return {
      subscribe: (listener: Listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
      upload: async () => {
        inputRef.current.click();
        return new Promise<File[]>(resolve => {
          actions.subscribe(function callback(files) {
            listeners.delete(callback);
            resolve(files);
          });
        });
      }
    };
  }, [listeners]);

  useEffect(() => {
    const input = inputRef.current;
    input.style.display = 'none';
    input.type = 'file';

    if (accept) {
      input.accept = accept;
    }

    const handleChange = (event: Event): void => {
      const files = getFilesFromEvent(event);
      listeners.forEach(notify => notify(files));
      input.value = '';
    };

    document.body.appendChild(input);
    input.addEventListener('change', handleChange);

    return () => {
      input.removeEventListener('change', handleChange);
      input.parentElement?.removeChild(input);
      listeners.clear();
    };
  }, [accept, listeners]);

  return actions;
}
