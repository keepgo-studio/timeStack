import styles from "../public/dialog.scoped.css"

export default class Dialog extends HTMLElement {

  constructor() {
    super()
    
    this.attachShadow({ mode : "open" })

    this.hour = this.getAttribute('hour');
    this.minutes = this.getAttribute('minutes');
    this.type = this.getAttribute('type');
  }

  connectedCallback() {
    this.render();

    this.shadowRoot.getElementById("save").addEventListener("click", this.handleSubmitEvent.bind(this));
    this.shadowRoot.getElementById("remove").addEventListener("click", this.handleSubmitEvent.bind(this));
  }
  
  disconnectedCallback() {
    console.log("dialog closed")
    this.shadowRoot.getElementById("save").removeEventListener("click", this.handleSubmitEvent);
    this.shadowRoot.getElementById("remove").removeEventListener("click", this.handleSubmitEvent);
  }
  
  handleSubmitEvent(e) {
    e.stopPropagation();
    
    let shouldSave;
    if (e.currentTarget.id === "save") shouldSave = true
    else shouldSave = false;

    console.log(shouldSave)
    this.dispatchEvent(new CustomEvent('should-save', {
      detail: { shouldSave },
    }));

    this.remove();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${styles.toString()}</style>
      
      <section>
        <main>
          <header>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z"/></svg>
          </header>

          <div class="text-block">
            <p>총</p>
            <h1>${this.hour}시간 ${this.minutes}분</h1>
            <p><b>${this.type}</b>하셨습니다</p>
            <p>저장할까요?</p>
          </div>

          <div class="button-block">
            <button id="save">저장</button>
            <button id="remove">삭제</button>
          </div>
        </main>
      </section>
    `
  }

  static get observedAttributes() {
    return ['hour', 'minutes', 'type']
  }

  attributeChangedCallback(attName, oldValue, newValue) {
    
    this[attName] = newValue;
  }
}