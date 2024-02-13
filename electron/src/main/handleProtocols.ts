import path from 'node:path';
import { format as URLFormat } from 'node:url';
import { protocol, net } from 'electron';
import { filesRootDir, rendererDir } from '../constants';
import { saveLog } from '../ipc/logs';

// https://github.com/electron/electron/issues/19775#issuecomment-522289694
// https://github.com/electron/electron/issues/19775#issuecomment-1001643667
// prettier-ignore
protocol.registerSchemesAsPrivileged([
  { scheme: 'http', privileges: { standard: true, bypassCSP: true, allowServiceWorkers: true, supportFetchAPI: true } },
  { scheme: 'file', privileges: { standard: true, bypassCSP: true, allowServiceWorkers: true, supportFetchAPI: true } },
]);

const staticRegex = /^\/static/;

// function for serve/rewrite local files path, optional
// https://www.electronjs.org/docs/latest/api/net#netfetchinput-init
async function serveLocalFiles(req: Request) {
  // eslint-disable-next-line prefer-const
  let { protocol, hostname, pathname } = new URL(req.url);

  // decodeURIComponent is important if url contains whitespace
  // it not working with  new URL(decodeURIComponent(req.url));
  pathname = decodeURIComponent(pathname);

  if (protocol === 'http:' && hostname === 'localhost') {
    pathname = pathname.replace(/^\//, '');
  } else if (protocol === 'file:' && pathname.startsWith(rendererDir)) {
    pathname = pathname.slice(rendererDir.length);
  }

  void saveLog(new Error(JSON.stringify({ protocol, rendererDir, pathname }, null, 2)));

  if (staticRegex.test(pathname)) {
    const filepath = URLFormat({
      pathname: path.join(filesRootDir, pathname.replace(staticRegex, '')),
      protocol: 'file:',
      slashes: true
    });
    return net.fetch(filepath, { bypassCustomProtocolHandlers: true });
  }

  return net.fetch(req, { bypassCustomProtocolHandlers: true });
}

// Note, this function should called before window load a file or url
export function handleProtocols() {
  protocol.handle('http', serveLocalFiles);
  protocol.handle('file', serveLocalFiles);
}
