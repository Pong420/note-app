import { MantineColorScheme } from '@mantine/core';

export const getMenuColors = (scheme: MantineColorScheme): [string, string] =>
  scheme === 'dark' ? [`#222`, `#1c1c1c`] : [`#f6f6f6`, `#fff`];
