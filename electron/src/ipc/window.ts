import { screen, BrowserWindow } from 'electron';
import { createR2MIpc } from './_ipc';

export const windowR2MIpc = createR2MIpc({
  isMouseOutsideOfWindow: (event, [w, h]: [number, number]) => {
    // https://gist.github.com/louisameline/1213bb112c6cb12a98b2ab525dfb8b07
    const window = BrowserWindow.fromWebContents(event.sender);
    const { x, y } = screen.getCursorScreenPoint();
    const [cx, cy] = window?.getPosition() ?? [0, 0];
    return x < cx || x > cx + w || y < cy || y > cy + h;
  }
});
