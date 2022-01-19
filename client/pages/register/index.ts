import { state } from "../../state";
import { Router } from "@vaadin/router";
customElements.define(
  "register-page",
  class extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
    roomId: string = "";
    addListeners() {
      const toshareButton = this.shadow.querySelector(".toshare-button");
      const input: any = this.shadow.querySelector(".input");
      const cs = state.getState();
      this.roomId = cs.roomId;
      toshareButton.addEventListener("click", () => {
        const name = input.value;
        state.setName(name);
        if (this.roomId == "") {
          state.signUp(() => {
            state.askNewRoom(() => {
              state.getRtdbId(() => {
                state.accessToRoom();
              });
            });
          });
          Router.go("/toshare");
        } else {
          state.signUp(() => {
            state.getRtdbId((err) => {
              if (err) {
                Router.go("/fullroom");
              } else {
                state.accessToRoom();
              }
            });
          });
          Router.go("/toshare");
        }
      });
    }
    connectedCallback() {
      this.render();
    }
    render() {
      const div = document.createElement("div");
      const style = document.createElement("style");
      div.className = "register-page";
      div.innerHTML = `
      <custom-text variant="titulo">Piedra Papel o Tijera</custom-text>
      <custom-text variant="body">Tu nombre</custom-text>
      <input type="text" name="nombre" class="input"/>
      <custom-button class="toshare-button">Empezar</custom-button>
      <div class="container">
        <custom-hand type="tijera"></custom-hand>
        <custom-hand type="piedra"></custom-hand>
        <custom-hand type="papel"></custom-hand>
      </div>
    `;
      style.innerHTML = `
      .register-page {
        padding: 20px 26px 0px 27px;
        margin: 0 auto;
        max-width: 322px;
        display: flex;
        flex-direction: column;
        gap: 8px;
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
        font-family: 'Odibee Sans', cursive;
        font-size: 45px;
        text-align: center;
      }
      @media (min-width: 951px) {
        .register-page  {
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
