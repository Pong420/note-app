import path from 'node:path';

export const electronDir = path.join(__dirname);
export const rootDir = path.join(electronDir, '..');
export const rendererDir = path.join(rootDir, 'build');
