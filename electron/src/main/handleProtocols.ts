import path from 'node:path';
import { format as URLFormat } from 'node:url';
import { protocol, net } from 'electron';
import { filesRootDir } from '../constants';

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
  let { pathname } = new URL(req.url);

  // decodeURIComponent is important if url contains whitespace
  // it not working with  new URL(decodeURIComponent(req.url));
  pathname = decodeURIComponent(pathname);

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
