import { matchPath } from 'react-router-dom';
import { default as TiptapImage } from '@tiptap/extension-image';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Slice } from '@tiptap/pm/model';
import { ImageView } from '@/components/Editor/Image/ImageView';
import { PathPatterns } from '@/routes';
import { notifications } from '@/utils/notifications';
import { file2Buffer } from '../utils/handleFile';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageResize: {
      setImage: (options: ImageViewAttributes) => ReturnType;
    };
  }
}

export interface ImageViewAttributes {
  src: string;
  title?: string;
  alt?: string;
  width: number;
  height: number;
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
      }
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageView);
  },

  addProseMirrorPlugins() {
    return [
      // this plugin creates a code block for pasted content from VS Code
      // we can also detect the copied code language
      new Plugin({
        key: new PluginKey('@notes/image'),
        props: {
          handleDrop: (view, event, _slice: Slice, moved: boolean) => {
            const pathPattern: PathPatterns = '/editor/:title/:id';
            const path = matchPath(pathPattern, window.location.hash.slice(1));
            const images = Array.from(event.dataTransfer?.files || []).filter(file => /^image\//.test(file.type));

            if (moved || !images.length || !path) return false;

            const { schema } = view.state;
            const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });

            const handleImage = async (file: File) => {
              const buffer = await file2Buffer(file);
              const src = await adapter.uploadAsset({ id: path.params.id as string }, { name: file.name, buffer });

              const image = new window.Image();
              image.src = src;
              image.onload = () => {
                const size = { width: image.naturalWidth, height: image.naturalHeight };
                const options: ImageViewAttributes = { ...size, src, ratio: size.width / (size.height || 1) };
                const node = schema.nodes.image.create(options);
                if (coordinates) {
                  const transaction = view.state.tr.insert(coordinates.pos, node); // places it in the correct position
                  view.dispatch(transaction);
                }
              };
            };

            for (const file of images) {
              handleImage(file).catch(notifications.onError({ title: 'Upload Image Failed' }));
            }

            return true;
          }
        }
      })
    ];
  }
});
