/* eslint-disable @typescript-eslint/no-explicit-any */
import { BrowserWindow, IpcMainEvent, IpcMainInvokeEvent, ipcMain } from 'electron';

export type Args<T extends (...args: any[]) => any> = Parameters<T> extends [infer F, ...infer R]
  ? F extends BrowserWindow | IpcMainEvent | IpcMainInvokeEvent
    ? [...R]
    : [F, ...R]
  : [];

// renderer to main
export type R2M<Args extends unknown[]> = (event: IpcMainInvokeEvent, ...args: Args) => unknown;
export type R2MIpcSchema<T extends Record<string, R2M<any[]>>> = {
  [K in keyof T]: (...args: Args<T[K]>) => Promise<Awaited<ReturnType<T[K]>>>;
};

// main to renderer
export interface M2RFn<Payload = unknown> {
  (payload?: Payload): void;
  (target: BrowserWindow | IpcMainEvent | IpcMainInvokeEvent, payload?: Payload): void;
}
export type M2RIpcSchema<T extends Record<string, any>> = {
  [K in keyof T]: M2RFn<T[K]>;
};

// main to renderer and wait for response from renderer
export type M2RWithReply = [req: any, reply: any];
export interface M2RWithReplyFn<Payload extends M2RWithReply> {
  (payload?: Payload[0]): Promise<Payload[1]>;
  (target: BrowserWindow | IpcMainEvent | IpcMainInvokeEvent, payload?: Payload[0]): Promise<Payload[1]>;
}
export type M2RWithReplyIpcSchema<T extends Record<string, M2RWithReply>> = {
  [K in keyof T]: M2RWithReplyFn<T[K]>;
};

// renderer to other renderers
export type R2R<Args extends unknown[]> = (event: IpcMainEvent, ...args: Args) => unknown;
export type R2RSender<T extends Record<string, R2R<any[]>>> = {
  [K in keyof T as K extends string ? `emit${Capitalize<K>}` : never]: (...args: Args<T[K]>) => void;
};

type ReceiverArgs<T> = T extends M2RWithReply
  ? T[0]
  : T extends (...args: any[]) => any
  ? Awaited<ReturnType<T>>
  : never;
export type Receiver<T extends Record<string, (...args: any[]) => any> | Record<string, M2RWithReply>> = {
  [K in keyof T as K extends string ? `on${Capitalize<K>}` : never]: (
    callback: (args: ReceiverArgs<T[K]>) => void
  ) => () => void;
};

export type Reply<T extends Record<string, M2RWithReply>> = {
  [K in keyof T as K extends string ? `reply${Capitalize<K>}` : never]: (payload: T[K][1]) => void;
};

export function createR2MIpc<Definition extends Record<string, R2M<any[]>>>(definition: Definition) {
  if (typeof ipcMain === 'undefined') return definition;

  for (const name in definition) {
    ipcMain.handle(name, definition[name as keyof typeof definition]);
  }

  return definition;
}

export function createM2RIpc<Definition extends object>(definition: Definition) {
  return Object.entries(definition).reduce((r, [name]) => {
    return {
      ...r,
      [name]: (...args: unknown[]) => {
        const [target, payload] = (args.length === 1 ? [args[0]] : args.length === 2 ? [args[0], args[1]] : []) as [
          (BrowserWindow | IpcMainEvent | IpcMainInvokeEvent)?,
          unknown?
        ];

        const win = target
          ? target instanceof BrowserWindow
            ? target
            : BrowserWindow.fromWebContents(target.sender)
          : BrowserWindow.getAllWindows();

        const action = (win: BrowserWindow) => {
          win.webContents.send(name, payload);
        };

        if (Array.isArray(win)) {
          return win.filter(Boolean).map(action);
        } else {
          if (!win) throw new Error(`bad implementation, window not found in ${name} M2R`);
          return action(win);
        }
      }
    };
  }, {} as M2RIpcSchema<Definition>);
}

export function createM2RWithReplyIpc<Definition extends Record<string, M2RWithReply>>(definition: Definition) {
  const senders = Object.entries(definition).reduce((r, [name]) => {
    return {
      ...r,
      [name]: (...args: unknown[]) => {
        const [target, payload] = (args.length === 1 ? [args[0]] : args.length === 2 ? [args[0], args[1]] : []) as [
          (BrowserWindow | IpcMainEvent | IpcMainInvokeEvent)?,
          unknown?
        ];

        const win = target
          ? target instanceof BrowserWindow
            ? target
            : BrowserWindow.fromWebContents(target.sender)
          : BrowserWindow.getAllWindows();

        const action = (win: BrowserWindow) => {
          return new Promise(resolve => {
            win.webContents.send(name, payload);
            ipcMain.once(name, (event, resp) => resolve(resp));
          });
        };

        if (Array.isArray(win)) {
          return Promise.all(win.filter(Boolean).map(action));
        } else {
          if (!win) throw new Error(`bad implementation, window not found in ${name} M2R`);
          return action(win);
        }
      }
    };
  }, {} as M2RWithReplyIpcSchema<Definition>);

  return { senders, definition };
}

export function createR2RIpc<Definition extends Record<string, R2R<any[]>>>(definition: Definition) {
  if (typeof ipcMain === 'undefined') return definition;

  for (const name in definition) {
    ipcMain.on(name, (event, ...args: unknown[]) => {
      try {
        const handle = definition[name as keyof typeof definition] as (...args: unknown[]) => unknown;
        const resp = handle(event, ...args);

        const broadcast = (event: string, payload: unknown) =>
          BrowserWindow.getAllWindows().forEach(win => win.webContents.send(event, payload));

        // should be same in electron/src/preload/index.ts
        // const replyName = `${name}`;
        if (resp instanceof Promise) {
          resp
            //
            .then(payload => broadcast(name, payload))
            .catch(error => event.reply('error', error));
        } else {
          broadcast(name, resp);
        }
      } catch (error) {
        event.reply('error', error);
      }
    });
  }

  return definition;
}
