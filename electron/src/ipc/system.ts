/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createIpcHandlers } from './ipcCreator';
import { system } from '../system';

export const systemHandlers = createIpcHandlers({
  getLastVisits() {
    return system.lastVisits;
  },
  updateLastVisits(_event, { id }: { id: string }) {
    system.lastVisits = [{ id, timestamp: Date.now() }, ...system.lastVisits.filter(l => l.id !== id)].slice(0, 4);
  }
});
