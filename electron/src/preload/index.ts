import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron';
import { handlers, broadcasts, Handlers, Args, BroadcastReceivers, BroadcastSenders } from '../ipc';

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
  ...Object.entries(broadcasts).reduce(
    (api, [key]) => ({
      ...api,
      [`emit${key}`]: (...args: unknown[]) => ipcRenderer.send(key, ...args),
      [`subscribe${key}`]: (callback: (...args: unknown[]) => void) => {
        const replyName = `${key}Reply`;
        const _callback = (_event: IpcRendererEvent, ...args: unknown[]) => callback(...args);
        ipcRenderer.on(replyName, _callback);
        return () => ipcRenderer.off(replyName, _callback);
      }
    }),
    {} as BroadcastSenders & BroadcastReceivers
  )
};

contextBridge.exposeInMainWorld('adapter', api);
