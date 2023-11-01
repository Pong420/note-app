/* eslint-disable @typescript-eslint/no-explicit-any */
import { BrowserWindow, IpcMainEvent, IpcMainInvokeEvent, ipcMain } from 'electron';

export type Args<T extends (...args: any[]) => any> = Parameters<T> extends [infer F, ...infer R]
  ? F extends IpcMainInvokeEvent
    ? [...R]
    : [F, ...R]
  : [];

// Handler is renderer to main
// https://www.electronjs.org/docs/latest/tutorial/ipc#pattern-2-renderer-to-main-two-way
export type Handler<Args extends unknown[]> = (event: IpcMainInvokeEvent, ...args: Args) => unknown;

// Request is main to renderer, wait for reply from renderer
// https://www.electronjs.org/docs/latest/tutorial/ipc#pattern-3-main-to-renderer
export type Request = (req: any, resp: any) => any;

export interface SendRequest<Response = unknown> {
  (): Promise<Response[]>;
  (target: BrowserWindow | IpcMainEvent | IpcMainInvokeEvent): Promise<Response>;
  (target?: BrowserWindow | IpcMainEvent | IpcMainInvokeEvent): Promise<Response>;
}
export type RequestSender<Requests extends Record<string, Request>> = {
  [K in keyof Requests as K extends string ? `${K}Request` : never]: SendRequest<Parameters<Requests[K]>[1]>;
};
export type RequestReply<Requests extends Record<string, Request>> = {
  [K in keyof Requests as K extends string ? `reply${Capitalize<K>}Request` : never]: (
    resp: Parameters<Requests[K]>[1]
  ) => void;
};
export type RequestReceiver<Requests extends Record<string, Request>> = {
  [K in keyof Requests as K extends string ? `on${Capitalize<K>}Request` : never]: (
    callback: (req: Parameters<Requests[K]>[0]) => void
  ) => () => void;
};

// Broadcast is renderer to all renderer
export type Broadcast<Args extends unknown[]> = (event: IpcMainEvent, ...args: Args) => unknown;
export type BroadcastSender<Broadcasts extends Record<string, Broadcast<any[]>>> = {
  [K in keyof Broadcasts as K extends string ? `emit${K}` : never]: (...args: Args<Broadcasts[K]>) => void;
};
export type BroadcastReceiver<Broadcasts extends Record<string, Broadcast<any[]>>> = {
  [K in keyof Broadcasts as K extends string ? `subscribe${K}` : never]: (
    callback: (args: Awaited<ReturnType<Broadcasts[K]>>) => void
  ) => () => void;
};

export function createIpcHandlers<H extends Record<string, Handler<any[]>>>(handlers: H) {
  return handlers;
}

export function createIpcRequests<H extends Record<string, Request>>(schema: H) {
  const requests = Object.entries(schema).reduce(
    (senders, [k]) => {
      const key = `${k}Request`;
      return {
        ...senders,
        [key]: (target?: BrowserWindow | IpcMainEvent | IpcMainInvokeEvent) => {
          const win = target
            ? target instanceof BrowserWindow
              ? target
              : BrowserWindow.fromWebContents(target.sender)
            : BrowserWindow.getAllWindows();

          const action = (win: BrowserWindow) => {
            return new Promise(resolve => {
              // should be same in electron/src/preload/index.ts and RequestReply, RequestReceiver
              const capitalized = key.charAt(0).toUpperCase() + key.slice(1);
              win.webContents.send(key);
              ipcMain.once(`reply${capitalized}`, (event, resp) => resolve(resp));
            });
          };

          if (Array.isArray(win)) {
            return Promise.all(win.filter(Boolean).map(action));
          } else {
            if (!win) throw new Error(`bad implementation, window not found in ${key} request`);
            return action(win);
          }
        }
      };
    },
    {} as RequestSender<typeof schema>
  );

  return { requests, schema };
}

export function createIpcBroadcast<B extends Record<string, Broadcast<any[]>>>(broadcasts: B) {
  return broadcasts;
}
