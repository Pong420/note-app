import { matchPath } from 'react-router-dom';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Node } from '@tiptap/core';
import { Slice } from '@tiptap/pm/model';
import { PathPatterns } from '@/routes';
import { notifications } from '@/utils/notifications';
import { VideoView } from './VideoView';
import { file2Buffer } from '../utils/handleFile';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    video: {
      setVideo: (options: VideoOptions) => ReturnType;
    };
  }
}

export interface VideoOptions {
  loop?: boolean;
  controls?: boolean;
  autoPlay?: boolean;
}

export interface VideoViewAttributes extends VideoOptions {
  src: string;
  width: number;
  height: number;
  ratio: number;
}

export const Video = Node.create({
  name: 'video',

  inline: false,

  group: 'block',

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null
      },
      loop: {
        default: false
      },
      controls: {
        default: false
      },
      autoPlay: {
        default: false
      },
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

  parseHTML() {
    return [
      {
        tag: 'video'
      }
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoView);
  },

  renderHTML({ HTMLAttributes }) {
    return ['video', HTMLAttributes];
  },

  addCommands() {
    return {
      setVideo:
        options =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options
          });
        }
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('@notes/video'),
        props: {
          handleDrop: (view, event, _slice: Slice, moved: boolean) => {
            const pathPattern: PathPatterns = '/editor/:title/:id';
            const path = matchPath(pathPattern, window.location.hash.slice(1));
            const videos = Array.from(event.dataTransfer?.files || []).filter(file => /^video\//.test(file.type));

            if (moved || !videos.length || !path) return false;

            const { schema } = view.state;
            const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });

            const handleVideo = async (file: File) => {
              const buffer = await file2Buffer(file);
              const src = await adapter.uploadAsset({ id: path.params.id as string }, { name: file.name, buffer });

              const video = document.createElement('video');
              video.src = src;
              video.onloadedmetadata = () => {
                const size = { width: video.videoWidth, height: video.videoHeight };
                const options: VideoViewAttributes = {
                  ...size,
                  src,
                  ratio: size.width / (size.height || 1),
                  autoPlay: true,
                  loop: true
                };

                const node = schema.nodes.video.create(options);

                if (coordinates) {
                  const transaction = view.state.tr.insert(coordinates.pos, node); // places it in the correct position
                  view.dispatch(transaction);
                }
              };
            };

            for (const file of videos) {
              handleVideo(file).catch(notifications.onError({ title: 'Upload Video Failed' }));
            }

            return true;
          }
        }
      })
    ];
  }
});
