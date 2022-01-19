customElements.define(
  "custom-button",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
    }
    render() {
      const shadow = this.attachShadow({ mode: "open" });
      const button = document.createElement("button");
      button.textContent = this.textContent;
      const style = document.createElement("style");
      style.innerHTML = `
          button{
            width: 100%;
            height: 87px;
            color: white;
            background-color: #006CFC;
            border: 10px solid #001997;
            border-radius: 10px;
            font-family: 'Odibee Sans', cursive;
            font-size: 45px;
          }
        `;
      shadow.appendChild(button);
      shadow.appendChild(style);
    }
  }
);
