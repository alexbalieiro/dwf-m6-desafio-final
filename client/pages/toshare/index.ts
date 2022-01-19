import { state } from "../../state";
import { Router } from "@vaadin/router";
const API_BASE_URL = process.env.API_BASE_URL;
customElements.define(
  "toshare-page",
  class extends HTMLElement {
    constructor() {
      super();
    }
    roomId: string = "";
    addListeners() {}
    connectedCallback() {
      state.subscribe(() => {
        const cs = state.getState();
        const onlineOpponent = cs.onlineOpponent;
        const startOpponent = cs.startOpponent;
        const pageToshare = API_BASE_URL + "/toshare";
        const URLactual = window.location.href;
        if (
          onlineOpponent === true &&
          startOpponent === false &&
          pageToshare == URLactual
        ) {
          state.getHistory(() => {
            Router.go("/instructions");
            console.log("obtuve el history");
          });
        } else {
          this.roomId = cs.roomId;
          //  Router.go("/toshare");
          this.render();
        }
      });
      const cs = state.getState();
      this.roomId = cs.roomId;
      this.render();
    }
    render() {
      const style = document.createElement("style");
      this.innerHTML = `
      <div class="toshare-page">
      <custom-text variant="body">
        Compartí el código:
      </custom-text>
        <div class="codigo">${this.roomId} </div>
      <custom-text variant="body">
        Con tu contrincante
      </custom-text>
      <div class="container">
        <custom-hand type="tijera"></custom-hand>
        <custom-hand type="piedra"></custom-hand>
        <custom-hand type="papel"></custom-hand>
      </div>
      </div>
    `;
      style.innerHTML = `
      .toshare-page {
        padding: 140px 26px 0px 27px;
        margin: 0 auto;
        max-width: 375px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .container{
        display:flex;
        justify-content: space-around;
        align-items: flex-end;
        margin-top: 127px;
      }
      .codigo{
        font-weight: 700;
        font-family: 'Ubuntu', sans-serif;
        font-size: 80px;
        text-align: center;
      }
      @media (min-width: 951px) {
        .toshare-page  {
          gap: 120px;
          justify-content: flex-end;
        }
      }
        `;
      this.appendChild(style);
      this.addListeners();
      window.onbeforeunload = function disconectPlayer() {
        state.setOnline(false);
      };
    }
  }
);
