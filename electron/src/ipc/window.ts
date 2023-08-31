import { screen, BrowserWindow } from 'electron';
import { createIpcHandlers } from './ipcCreator';

export const windowHandlers = createIpcHandlers({
  isMouseOutsideOfWindow: (_event, [w, h]: [number, number]) => {
    // https://gist.github.com/louisameline/1213bb112c6cb12a98b2ab525dfb8b07
    const window = BrowserWindow.getAllWindows()[0];
    const { x, y } = screen.getCursorScreenPoint();
    const [cx, cy] = window?.getPosition() ?? [0, 0];
    return x < cx || x > cx + w || y < cy || y > cy + h;
  }
});
