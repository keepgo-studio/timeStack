"use strict"
import Layout from "./Layout.js";
import RadioButton from "./RadioButton.js";
import Dialog from "./Dialog.js";
import MemoEditor from "./MemoEditor.js"

customElements.define('ts-layout', Layout);
customElements.define('ts-button', RadioButton);
customElements.define('ts-dialog', Dialog);
customElements.define('ts-memo-editor', MemoEditor);