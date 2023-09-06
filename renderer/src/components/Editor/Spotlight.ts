import { spotlight } from '@mantine/spotlight';
import { Extension } from '@tiptap/core';

export const shortcut = ['Mod-p'];

const open = () => {
  spotlight.open();
  return true;
};

export const Spotlight = Extension.create({
  addKeyboardShortcuts() {
    return shortcut.reduce((fn, key) => ({ ...fn, [key]: open }), {} as Record<string, typeof open>);
  }
});
