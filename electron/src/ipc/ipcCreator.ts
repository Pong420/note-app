/* eslint-disable @typescript-eslint/no-explicit-any */
import { IpcMainEvent, IpcMainInvokeEvent } from 'electron';

export type Args<T extends (...args: any[]) => any> = Parameters<T> extends [infer F, ...infer R]
  ? F extends IpcMainInvokeEvent
    ? [...R]
    : [F, ...R]
  : [];

export type Handler<Args extends unknown[]> = (event: IpcMainInvokeEvent, ...args: Args) => unknown;
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

export function createIpcBroadcast<B extends Record<string, Broadcast<any[]>>>(broadcasts: B) {
  return broadcasts;
}
