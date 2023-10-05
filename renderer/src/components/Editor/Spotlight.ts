import { Extension } from '@tiptap/core';
import { spotlight } from '@/components/Spotlight/utils';

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
