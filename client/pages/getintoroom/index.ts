import { Router } from "@vaadin/router";
import { state } from "../../state";
customElements.define(
  "getintoroom-page",
  class extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
    addListeners() {
      const newgamebuttonEL = this.shadow.querySelector(".register-button");
      const input: any = this.shadow.querySelector(".input");
      newgamebuttonEL.addEventListener("click", () => {
        const roomId = input.value;
        state.setRoomId(roomId);
        Router.go("/register");
      });
    }

    connectedCallback() {
      this.render();
    }
    render() {
      const div = document.createElement("div");
      const style = document.createElement("style");
      div.className = "getintoroom-page";
      div.innerHTML = `
      <custom-text variant="titulo">Piedra Papel o Tijera</custom-text>
      <input type="text" name="nombre" class="input" placeholder="Código"/>
      <custom-button class="register-button">Ingresar a la sala</custom-button>
      <div class="container">
        <custom-hand type="tijera"></custom-hand>
        <custom-hand type="piedra"></custom-hand>
        <custom-hand type="papel"></custom-hand>
      </div>
    `;
      style.innerHTML = `
      .getintoroom-page {
        padding: 58px 26px 0px 27px;
        margin: 0 auto;
        max-width: 322px;
        display: flex;
        flex-direction: column;
        gap: 35px;
      }
      .container{
        display:flex;
        justify-content: space-around;
        align-items: flex-end;
      }
      .input{
        height:62px;
        border: 10px solid #182460;
        border-radius: 10px;
        font-family: 'Ubuntu', cursive;
        font-size: 45px;
        text-align: center;
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
