export default class Layout extends HTMLElement {
  
  constructor() {
    super()
  }

  connectedCallback(){
    this.attachShadow({mode: 'open'})
    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <div>
        Hello Component !
        <slot name="children"></slot>
        Between Component
      </div>
    `
  }
}