import styles from "../public/radio-button.scoped.css";

export default class RadioButton extends HTMLElement {

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.checked = false;
    this.buttonType = this.getAttribute("button-type");
    this.buttonStyle = this.getAttribute("button-style");
  }

  connectedCallback() {
    this.render();
    this.shadowRoot.querySelector("input").addEventListener("click", this.handleClick.bind(this));
    this.shadowRoot.querySelector("input").checked = this.getAttribute('checked')? true : false;
  }
  
  disconnectedCallback() {
    this.shadowRoot.querySelector("input").removeEventListener("click", this.handleClick)
  }

  handleClick(e) {
    e.stopPropagation();
    this.checked = e.currentTarget.checked

    this.dispatchEvent(new CustomEvent('change', {
      detail: {isChecked : this.checked},
    }))
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${styles.toString()}</style>
      <input type=${this.buttonType} class=${this.buttonStyle}>
    `;
  }

  static get observedAttributes() {
    return ['checked']
  }

  attributeChangedCallback(attName, oldValue, newValue) {
    console.log(attName, 'changed : ',oldValue, '->',newValue);
    switch(attName){
      case "checked":
        if (newValue === "true")
          this.shadowRoot.querySelector('input').checked = true
        else 
          this.shadowRoot.querySelector('input').checked = false
        break;
    }
  }
}
