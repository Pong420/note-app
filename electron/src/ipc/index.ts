import { Args, BroadcastReceiver, BroadcastSender } from './ipcCreator';
import { windowHandlers } from './window';

export type Handlers = {
  [K in keyof typeof handlers]: (
    ...args: Args<(typeof handlers)[K]>
  ) => Promise<Awaited<ReturnType<(typeof handlers)[K]>>>;
};

export type { Args } from './ipcCreator';
export type BroadcastSenders = BroadcastSender<typeof broadcasts>;
export type BroadcastReceivers = BroadcastReceiver<typeof broadcasts>;

export interface ElectronIPC extends Handlers, BroadcastSenders, BroadcastReceivers {}

export const handlers = {
  ...windowHandlers
};

export const broadcasts = {};
