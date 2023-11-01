import { Args, RequestReply, RequestReceiver, BroadcastReceiver, BroadcastSender } from './ipcCreator';
import { windowHandlers } from './window';
import { filesHandlers, filesBroadcasts } from './files';
import { systemHandlers } from './system';

export type Handlers = {
  [K in keyof typeof handlers]: (
    ...args: Args<(typeof handlers)[K]>
  ) => Promise<Awaited<ReturnType<(typeof handlers)[K]>>>;
};

export type { Args } from './ipcCreator';
export type RequestReplies = RequestReply<typeof requests>;
export type RequestReceivers = RequestReceiver<typeof requests>;
export type BroadcastSenders = BroadcastSender<typeof broadcasts>;
export type BroadcastReceivers = BroadcastReceiver<typeof broadcasts>;

export interface ElectronIPC extends Handlers, BroadcastSenders, BroadcastReceivers {}

declare global {
  interface Window {
    adapter: ElectronIPC;
  }
  const adapter: ElectronIPC;
}

export const handlers = {
  ...windowHandlers,
  ...filesHandlers,
  ...systemHandlers
};

export const broadcasts = {
  ...filesBroadcasts
};

export const requests = {};
