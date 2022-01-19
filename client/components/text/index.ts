customElements.define(
  "custom-text",
  class extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      this.render();
    }
    render() {
      const variant = this.getAttribute("variant") || "body;";
      const div = document.createElement("div");
      const style = document.createElement("style");
      style.innerHTML = `
        .titulo{
          font-family: "Gluten";
          font-size: 78px;
          color: #009048;
          margin: 0;
        }
        .right{
          font-family: 'Odibee Sans', cursive;;
          font-size: 55px;
          text-align: right;
        }
        .body{
          font-family: 'Odibee Sans', cursive;;
          font-size: 55px;
          text-align: center;
        }
        `;
      div.className = variant;
      div.innerHTML = this.textContent;
      this.shadow.appendChild(div);
      this.shadow.appendChild(style);
    }
  }
);
