import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron';
import { r2mIpc, r2rIpc, m2rIpc, m2rWithReplyDefinition, R2MIpcSchema, R2RSender, Receiver, Reply } from '../ipc';

export type R2MIpc = R2MIpcSchema<typeof r2mIpc>;
export type R2RSenders = R2RSender<typeof r2rIpc>;
export type R2RReceivers = Receiver<typeof r2rIpc>;
export type M2RReceivers = Receiver<typeof m2rIpc>;
export type M2RWithReplyReceivers = Receiver<typeof m2rWithReplyDefinition>;
export type M2RReplies = Reply<typeof m2rWithReplyDefinition>;

export interface ElectronIPC
  extends R2MIpc,
    R2RSenders,
    R2RReceivers,
    M2RReceivers,
    M2RWithReplyReceivers,
    M2RReplies {}

declare global {
  interface Window {
    adapter: ElectronIPC;
  }
  const adapter: ElectronIPC;
}

const ipc = {
  ...Object.entries(r2mIpc).reduce(
    (api, [key]) => ({
      ...api,
      [key]: (...args: unknown[]) => ipcRenderer.invoke(key, ...args)
    }),
    {} as R2MIpc
  ),
  ...Object.entries(r2rIpc).reduce(
    (api, [name]) => {
      const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
      return {
        ...api,
        [`emit${capitalized}`]: (...args: unknown[]) => ipcRenderer.send(name, ...args),
        [`on${capitalized}`]: (callback: (...args: unknown[]) => void) => {
          const _callback = (_event: IpcRendererEvent, ...args: unknown[]) => callback(...args);
          ipcRenderer.on(name, _callback);
          return () => ipcRenderer.off(name, _callback);
        }
      };
    },
    {} as R2RSenders & R2RReceivers
  ),
  ...Object.entries(m2rIpc).reduce((api, [name]) => {
    const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
    return {
      ...api,
      [`on${capitalized}`]: (callback: (...args: unknown[]) => void) => {
        const _callback = (_event: IpcRendererEvent, ...args: unknown[]) => callback(...args);
        ipcRenderer.on(name, _callback);
        return () => ipcRenderer.off(name, _callback);
      }
    };
  }, {} as M2RReceivers),
  ...Object.entries(m2rWithReplyDefinition).reduce(
    (api, [name]) => {
      const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
      return {
        ...api,
        [`reply${capitalized}`]: (...args: unknown[]) => ipcRenderer.send(name, ...args),
        [`on${capitalized}`]: (callback: (...args: unknown[]) => void) => {
          const _callback = (_event: IpcRendererEvent, ...args: unknown[]) => callback(...args);
          ipcRenderer.on(name, _callback);
          return () => ipcRenderer.off(name, _callback);
        }
      };
    },
    {} as M2RReplies & M2RReceivers
  )
};

contextBridge.exposeInMainWorld('adapter', ipc);
