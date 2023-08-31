/* eslint-disable @typescript-eslint/no-floating-promises */
import os from 'node:os';
import path from 'node:path';
import { app, BrowserWindow, shell, net, BrowserWindowConstructorOptions } from 'electron';
import { update } from './update';
import { handleProtocols } from './handleProtocols';
import { electronDir, rendererDir } from '../constants';
import './ipcRegistration';

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

const isDevelopment = process.env.NODE_ENV === 'development';
// const isProduction = !isDevelopment;

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = path.join(electronDir, 'preload', 'index.js');
const url = `http://localhost:5173`;
const indexHtml = path.join(rendererDir, 'index.html');

function createWindow() {
  handleProtocols();

  const opts: BrowserWindowConstructorOptions = {
    // title: 'Main window',
    // icon: join(process.env.VITE_PUBLIC, 'logo.svg'),
    darkTheme: true,
    width: process.env.NODE_ENV === 'development' ? 1920 : 1280 + 240,
    height: 1080,
    frame: false,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: false,
      contextIsolation: true
    }
  };

  win = new BrowserWindow(opts);

  if (isDevelopment) {
    const loadURL = async (): Promise<void> => {
      return net
        .fetch(url, { bypassCustomProtocolHandlers: true })
        .then(() => {
          win?.loadURL(url);
          win?.webContents.openDevTools();
        })
        .catch(() => new Promise(resolve => setTimeout(resolve, 100)).then(loadURL));
    };
    loadURL();
  } else {
    win.loadFile(indexHtml);
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^http:\/\/localhost/.test(url) || /^file:/.test(url))
      return {
        action: 'allow',
        overrideBrowserWindowOptions: opts
      };
    // open with the browser, not with the application
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });

  // Apply electron-updater
  update(win);
}

app.whenReady().then(createWindow);

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
    createWindow();
  }
});
