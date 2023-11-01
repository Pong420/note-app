import { DefaultMantineColor } from '@mantine/core';

export const isElectron = true;

export const APP_REGION_HEIGHT = 40;

export const editorColors = [
  '#fa5252',
  '#e64980',
  '#be4bdb',
  '#7950f2',
  '#4c6ef5',
  '#228be6',
  '#15aabf',
  '#12b886',
  '#40c057',
  '#82c91e',
  '#fab005',
  '#fd7e14',
  '#868e96',
  '#25262b'
];

export const themeColors: DefaultMantineColor[] = [
  'red',
  'pink',
  'grape',
  'violet',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'green',
  'lime',
  'yellow',
  'orange'
];

export type TextBubbleMenuOption = (typeof textBubbleMenuOptions)[number][number];

export const textBubbleMenuOptions = [
  ['Bold', 'Italic', 'Underline', 'Strikethrough', 'Code', 'ColorPicker', 'Highlight', 'ClearFormatting'],
  ['AlignCenter', 'AlignJustify', 'AlignLeft', 'AlignRight'],
  ['H1', 'H2', 'H3', 'H4'],
  ['BulletList', 'OrderedList'],
  ['Link', 'Unlink']
] as const;
