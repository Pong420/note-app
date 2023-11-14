import { windowR2MIpc } from './window';
import { systemR2MIpc } from './system';
import { filesR2MIpc, filesR2RIpc } from './files';

export * from './_ipc';

export const r2mIpc = {
  ...filesR2MIpc,
  ...systemR2MIpc,
  ...windowR2MIpc
};

export const r2rIpc = {
  ...filesR2RIpc
};

export const m2rWithReplyDefinition = {};

export const m2rIpc = {};
