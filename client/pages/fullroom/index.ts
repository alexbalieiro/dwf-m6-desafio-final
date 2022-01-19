import { Router } from "@vaadin/router";
import { state } from "../../state";
customElements.define(
  "fullroom-page",
  class extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
    roomId: string = "";
    connectedCallback() {
      this.render();
      const backButton = this.shadow.querySelector(".back-button");
      backButton.addEventListener("click", () => {
        Router.go("/");
      });
    }
    render() {
      const style = document.createElement("style");
      this.shadow.innerHTML = `
      <div class="fullroom-page">
        <custom-text variant="titulo">Piedra Papel o Tijera</custom-text>
        <custom-text variant="body">
          Ups, esta sala está completa y tu nombre no coincide con nadie en la sala.
        </custom-text>
        <custom-button class="back-button">Volver</custom-button>
      </div>
    `;

      style.innerHTML = `
      .fullroom-page {
        padding: 20px 26px 0px 27px;
        margin: 0 auto;
        max-width: 322px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      @media (min-width: 951px) {
        .fullroom-page  {
          gap: 100px;
          justify-content: flex-end;
        }
        `;
      this.shadow.appendChild(style);
    }
  }
);
