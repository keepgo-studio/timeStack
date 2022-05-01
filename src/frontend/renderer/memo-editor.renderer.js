import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";

class SimpleImage {
    static get toolbox() {
      return {
        title: "Image",
        icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
        inlineToolbar: true
      };
    }
  
    render() {
      return document.createElement("input");
    }
  
    save(blockContent) {
      return {
        url: blockContent.value,
      };
    }
  }

  
const editor = new EditorJS({
  autofocus: true,
  tools: {
      image: SimpleImage,
      header: {
          class: Header,
          shortcut: 'CMD+SHIFT+H',
          inlineToolbar: true
      }
  },
});

window.addEventListener("message", async (e) => {
    let origin = e.origin || e.originalEvent.origin;

    if (typeof e.data === 'object' && e.data.call==='shouldSave') {
        if (e.data.value) {
            const data = await editor.save()

            window.parent.postMessage({
                channel:"memo-editor--save",
                editorJson: JSON.stringify(data)
            })
        }
        else {
          window.parent.postMessage({
            channel:"memo-editor--unsave",
            editorJson: null
          })
        }

        
    }
}, false)