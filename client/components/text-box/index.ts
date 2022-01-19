customElements.define(
  "custom-textbox",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
    }
    render() {
      const shadow = this.attachShadow({ mode: "open" });
      const input = document.createElement("input");
      const style = document.createElement("style");
      style.innerHTML = `
          input{
            width: 100%;
            height: 84px;
            color: white;
            border: 10px solid #001997;
            border-radius: 10px;
            font-family: 'Odibee Sans', cursive;
            font-size: 45px;
          }
        `;
      shadow.appendChild(input);
      shadow.appendChild(style);
    }
  }
);
