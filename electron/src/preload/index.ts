import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron';
import {
  handlers,
  requests,
  broadcasts,
  Handlers,
  Args,
  RequestReplies,
  RequestReceivers,
  BroadcastReceivers,
  BroadcastSenders
} from '../ipc';

type HanderAPI = {
  [K in keyof Handlers]: (...args: Args<Handlers[K]>) => Promise<Awaited<ReturnType<Handlers[K]>>>;
};

const api = {
  ...Object.entries(handlers).reduce(
    (api, [key]) => ({
      ...api,
      [key]: (...args: unknown[]) => ipcRenderer.invoke(key, ...args)
    }),
    {} as HanderAPI
  ),
  ...Object.entries(requests).reduce(
    (api, [key]) => {
      const capitalized = key.charAt(0).toUpperCase() + key.slice(1);
      const replyKey = `reply${capitalized}Request`;
      return {
        ...api,
        [replyKey]: (...args: unknown[]) => ipcRenderer.send(replyKey, ...args),
        [`on${capitalized}Request`]: (callback: (...args: unknown[]) => void) => {
          const receiverKey = `${key}Request`;
          const _callback = (...args: unknown[]) => callback(...args);
          ipcRenderer.on(receiverKey, _callback);
          return () => ipcRenderer.off(receiverKey, _callback);
        }
      };
    },
    {} as RequestReplies & RequestReceivers
  ),
  ...Object.entries(broadcasts).reduce(
    (api, [key]) => ({
      ...api,
      [`emit${key}`]: (...args: unknown[]) => ipcRenderer.send(key, ...args),
      [`subscribe${key}`]: (callback: (...args: unknown[]) => void) => {
        const replyName = `${key}Broadcast`;
        const _callback = (_event: IpcRendererEvent, ...args: unknown[]) => callback(...args);
        ipcRenderer.on(replyName, _callback);
        return () => ipcRenderer.off(replyName, _callback);
      }
    }),
    {} as BroadcastSenders & BroadcastReceivers
  )
};

contextBridge.exposeInMainWorld('adapter', api);
