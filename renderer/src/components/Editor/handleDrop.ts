import { Slice } from '@tiptap/pm/model';
import { EditorView } from '@tiptap/pm/view';

// refernces
// https://www.codemzy.com/blog/tiptap-drag-drop-image
export function handleDrop(view: EditorView, event: DragEvent, slice: Slice, moved: boolean) {
  if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
    const file = event.dataTransfer.files[0]; // the dropped file

    if (/^image\//.test(file.type)) {
      const { schema } = view.state;
      const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
      const src = URL.createObjectURL(file);

      const image = new Image();
      image.src = src;
      image.onload = () => {
        const size = { width: image.naturalWidth, height: image.naturalHeight };
        const node = schema.nodes.image.create({ ...size, src, ratio: size.width / size.height });

        if (coordinates) {
          const transaction = view.state.tr.insert(coordinates.pos, node); // places it in the correct position
          view.dispatch(transaction);
        }
      };
    } else {
      window.alert('Images need to be in jpg or png format and less than 10mb in size.');
    }
    return true; // handled}
  }

  return false;
}
