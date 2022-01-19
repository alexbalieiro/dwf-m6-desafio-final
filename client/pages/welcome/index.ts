import { Router } from "@vaadin/router";
const API_BASE_URL = process.env.API_BASE_URL;
customElements.define(
  "welcome-page",
  class extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
    addListeners() {
      const newgamebuttonEL = this.shadow.querySelector(".register-button");
      newgamebuttonEL.addEventListener("click", () => {
        Router.go("/register");
      });
      const getintobuttonEL = this.shadow.querySelector(".getinto-button");
      getintobuttonEL.addEventListener("click", () => {
        Router.go("/getintoroom");
      });
    }

    connectedCallback() {
      this.render();
      console.log(API_BASE_URL);
    }
    render() {
      const div = document.createElement("div");
      const style = document.createElement("style");
      div.className = "welcome-page";
      div.innerHTML = `
      <custom-text variant="titulo">Piedra Papel o Tijera</custom-text>
      <custom-button class="register-button">Nuevo Juego</custom-button>
      <custom-button class="getinto-button">Ingresar a una sala</custom-button>
      <div class="container">
        <custom-hand type="tijera"></custom-hand>
        <custom-hand type="piedra"></custom-hand>
        <custom-hand type="papel"></custom-hand>
      </div>
    `;
      style.innerHTML = `
      .welcome-page {
        padding: 70px 26px 0px 27px;
        margin: 0 auto;
        max-width: 322px;
        display: flex;
        flex-direction: column;
        gap: 30px;
      }
      .container{
        display:flex;
        justify-content: space-around;
        align-items: flex-end;
      }
      @media (min-width: 951px) {
        .welcome-page  {
          gap: 100px;
          justify-content: flex-end;
        }
        `;
      this.shadow.appendChild(div);
      this.shadow.appendChild(style);
      this.addListeners();
    }
  }
);
