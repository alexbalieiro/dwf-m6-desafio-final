customElements.define(
  "custom-counter",
  class extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      this.render();
    }
    counter(numberEl: Element) {
      let counter = 3;
      const intervalId = setInterval(() => {
        counter--;
        numberEl.textContent = counter.toString();
        if (counter < 0) {
          const event = new CustomEvent("finish", {
            detail: {
              finish: counter,
            },
          });
          clearInterval(intervalId);
          this.dispatchEvent(event);
        }
      }, 1000);
    }
    render() {
      const style = document.createElement("style");
      this.shadow.innerHTML = `
      <div class="container">
        <div class="circulo"">
          <div class="number">3</div>
        </div>
      </div>
      `;
      style.innerHTML = `
      .container{
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .circulo {
        width: 200px;
        height: 200px;
        border: 23px solid #000000;
        border-radius: 50%;
        display:flex;
        justify-content: center;
        align-items: center;
      }
      .number{
        font-family: 'Odibee Sans', cursive;
        font-size: 150px;
        font-weight: bold;
      }
      `;
      const numberEl = this.shadow.querySelector(".number");
      this.counter(numberEl);
      this.shadow.appendChild(style);
    }
  }
);
