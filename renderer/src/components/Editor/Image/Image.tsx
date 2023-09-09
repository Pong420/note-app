import TiptapImage from '@tiptap/extension-image';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ImageView } from '@/components/Editor/Image/ImageView';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageResize: {
      setImage: (options: {
        src: string;
        alt?: string;
        title?: string;
        width?: string | number;
        height?: string | number;
      }) => ReturnType;
    };
  }
}

export interface ImageViewAttributes {
  src: string;
  title?: string;
  alt?: string;
  width: number;
  height: number;
  maxWidth: number;
  ratio: number;
}

export const Image = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        renderHTML: attributes => {
          return {
            width: typeof attributes.width === 'number' ? `${attributes.width}px` : (attributes.width as string)
          };
        }
      },
      height: {
        default: 'auto',
        renderHTML: attributes => {
          return {
            height: typeof attributes.height === 'number' ? `${attributes.height}px` : (attributes.height as string)
          };
        }
      },
      ratio: {
        default: 0
      },
      maxWidth: {
        default: 100,
        renderHTML: () => {
          return {};
        }
      },
      display: {
        default: 'center',
        renderHTML: () => {
          return {};
        }
      }
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageView);
  }
});
