import Editor from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css"

export default class MemoEditor extends HTMLElement {
  constructor() {
    super()

    // this.attachShadow({ mode: "open"} )
  }

  connectedCallback() {
    this.render();

    const editor = new Editor({
      el: this.querySelector("#editor"),
      height: '500px',
      initialEditType: "markdown",
      previewStyle: "vertical",
    })
  }

  handleKeyPress

  render() {
    this.innerHTML = `
    <div id="editor" style="background-color: #fff;"></div>
    `
  }

  disconnectedCallback() {

  }
}