import styles from "../public/dialog.scoped.css"

export default class Dialog extends HTMLElement {

  constructor() {
    super()
    
    this.attachShadow({ mode : "open" })

    this.hour = this.getAttribute('hour') || 1;
    this.minutes = this.getAttribute('minutes') || 12;
    this.type = this.getAttribute('type') || "작업";
  }

  connectedCallback() {
    this.render();

    this.shadowRoot.querySelector("button").addEventListener("click", () => {
      this.remove();
    })
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
            <p>바로 저장할까요?</p>
          </div>

          <div class="button-block">
            <button>저장</button>
            <button>삭제</button>
          </div>
        </main>
      </section>
    `
  }

  disconnectedCallback() {
    console.log("Asasd")
  }
}