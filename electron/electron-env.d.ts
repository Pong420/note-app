import { ElectronIPC } from './src/ipc';

declare global {
  interface Window {
    adapter: ElectronIPC;
  }
  const adapter: ElectronIPC;
}
