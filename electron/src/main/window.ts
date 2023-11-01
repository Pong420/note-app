/* eslint-disable @typescript-eslint/no-floating-promises */
import fs from 'fs-extra';
import path from 'node:path';
import { BrowserWindow, shell, BrowserWindowConstructorOptions, net } from 'electron';
import { electronDir, rendererDir, storageDir } from '../constants';
import { deepMerge } from '../utils/deepMerge';

const isEnvDevelopment = process.env.NODE_ENV === 'development';
const windowStatePath = path.join(storageDir, 'window-state.json');

export const initialWindowState = {
  x: undefined as number | undefined,
  y: undefined as number | undefined,
  width: process.env.NODE_ENV === 'development' ? 1920 : 1280 + 240,
  height: 1080,
  lastVisit: ''
};

export let windowState = deepMerge(
  initialWindowState,
  (fs.readJSONSync(windowStatePath, { throws: false }) as typeof initialWindowState) || {}
);

const setWindowState = (paylod: Partial<typeof initialWindowState>) => {
  windowState = { ...windowState, ...paylod };
  fs.writeFile(windowStatePath, JSON.stringify(windowState, null, 2)).catch(console.error);
};

const lastVisit = windowState.lastVisit;
const url = `http://localhost:5173/#${lastVisit}`;
const indexHtml = path.join(rendererDir, 'index.html');

const preload = path.join(electronDir, 'preload', 'index.js');

export const windowOptions: BrowserWindowConstructorOptions = {
  ...windowState,
  darkTheme: true,
  frame: false,
  titleBarStyle: 'hiddenInset',
  webPreferences: {
    preload,
    nodeIntegration: false,
    contextIsolation: true
  }
};

export function createMainWindow() {
  const window = new BrowserWindow(windowOptions);

  if (isEnvDevelopment) {
    const loadURL = async (): Promise<void> => {
      return net
        .fetch(url, { bypassCustomProtocolHandlers: true })
        .then(() => {
          window.loadURL(url);
          window.webContents.openDevTools();
        })
        .catch(() => new Promise(resolve => setTimeout(resolve, 100)).then(loadURL));
    };
    loadURL();
  } else {
    window.loadFile(indexHtml, { hash: lastVisit });
  }

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });

  const updateBounds = () => {
    setWindowState(window.getBounds());
  };

  window.on('moved', updateBounds);
  window.on('resized', updateBounds);
  window.webContents.on('did-start-navigation', event => {
    const url = event.url;
    if (url.includes('#')) setWindowState({ lastVisit: url.split('#')[1] });
  });

  return window;
}
