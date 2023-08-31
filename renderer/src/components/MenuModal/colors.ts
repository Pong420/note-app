import { ColorScheme } from '@mantine/core';

export const getMenuColors = (scheme: ColorScheme): [string, string] =>
  scheme === 'dark' ? [`#222`, `#1c1c1c`] : [`#f6f6f6`, `#fff`];
