/* eslint-disable @typescript-eslint/no-floating-promises */
import os from 'node:os';
import { app, BrowserWindow } from 'electron';
import { handleProtocols } from './handleProtocols';
import { createMainWindow } from './window';
import '../ipc';

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;

function start() {
  handleProtocols();

  createMainWindow();

  // TODO:
  // Apply electron-updater
  // update(window);
}

app.whenReady().then(start);

app.on('window-all-closed', () => {
  win = null;
  app.quit();
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createMainWindow();
  }
});
