import { BrowserWindow, ipcMain } from 'electron';
import { handlers, broadcasts } from '../ipc';

// https://stackoverflow.com/a/40251412
// for communication between window
const broadcast = (event: string, payload: unknown) =>
  BrowserWindow.getAllWindows().forEach(win => win.webContents.send(event, payload));

for (const name in handlers) {
  ipcMain.handle(name, handlers[name as keyof typeof handlers]);
}

for (const name in broadcasts) {
  ipcMain.on(name, (event, ...args: unknown[]) => {
    try {
      const handle = broadcasts[name as keyof typeof broadcasts] as (...args: unknown[]) => unknown;
      const resp = handle(event, ...args);
      const replyName = `${name}Reply`;
      if (resp instanceof Promise) {
        resp
          //
          .then(payload => broadcast(replyName, payload))
          .catch(error => event.reply('error', error));
      } else {
        broadcast(replyName, resp);
      }
    } catch (error) {
      event.reply('error', error);
    }
  });
}
