import { Router } from "@vaadin/router";
import { state } from "../../state";
const API_BASE_URL = process.env.API_BASE_URL;
customElements.define(
  "waiting-page",
  class extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
    startOpponent: boolean = false;
    myName = "";
    nameOpponent: string = "";
    myScore = 0;
    scoreOpp = 0;
    roomId = "";
    onlineOpp = false;
    addListeners() {
      state.subscribe(() => {
        const cs = state.getState();
        const startOpponent = cs.startOpponent;
        const pageWaiting = API_BASE_URL + "/waiting";
        const URLactual = window.location.href;
        this.roomId = cs.roomId;
        this.myName = cs.name;
        this.nameOpponent = cs.nameOpponent;
        if (startOpponent === true && URLactual == pageWaiting) {
          Router.go("/play");
        }
      });
    }

    connectedCallback() {
      const cs = state.getState();
      this.startOpponent = cs.startOpponent;
      this.roomId = cs.roomId;
      this.myName = cs.name;
      this.nameOpponent = cs.nameOpponent;
      this.onlineOpp = cs.onlineOpponent;
      const resultado = state.score();
      this.myScore = resultado.score.myPlay;
      this.scoreOpp = resultado.score.opponent;
      if (this.startOpponent) {
        Router.go("/play");
      }
      if (this.onlineOpp == false) {
        this.offline();
        state.setStart(false);
      } else {
        this.render();
      }
    }
    offline() {
      const div = document.createElement("div");
      const style = document.createElement("style");
      div.className = "waiting-page";
      div.innerHTML = `
        <header class=header-container>
        <div class=nombres>
          <p>${this.myName}: ${this.myScore}</p>
          <p class="red">${this.nameOpponent}: ${this.scoreOpp}</<p>
        </div>
        <div class=sala>
          <p>Sala</p>
          <p>${this.roomId}</p>
        </div>
      </header>
        <custom-text variant="body">
          ${this.nameOpponent} abandonó la sala...
        </custom-text>
        <div class="container">
          <custom-hand type="tijera"></custom-hand>
          <custom-hand type="piedra"></custom-hand>
          <custom-hand type="papel"></custom-hand>
        </div>
      `;
      style.innerHTML = `
        .waiting-page {
          padding: 20px 26px 0px 27px;
          margin: 0 auto;
          max-width: 322px;
          display: flex;
          flex-direction: column;
          gap: 139px;
        }
        .container{
          display:flex;
          justify-content: space-around;
          align-items: flex-end;
        }
        .text{
          font-size: 52px;
        }
        .header-container{
          height: 60px;
          display:flex;
          justify-content: space-between;
          align-items: center;
          font-size: 24px;
          font-family: 'Ubuntu', cursive;
          font-weight: 700;
        }
        .header-container p{
          margin:0;
        }
        .red{
          color: #FF6442;
        }
        .sala{
          text-align:right;
        }
        @media (min-width: 951px) {
          .waiting-page {
            gap: 120px;
            justify-content: flex-end;
          }
        }
          `;
      this.shadow.appendChild(div);
      this.shadow.appendChild(style);
      this.addListeners();
      window.onbeforeunload = function disconectPlayer() {
        state.setOnline(false);
      };
    }
    render() {
      const div = document.createElement("div");
      const style = document.createElement("style");
      div.className = "waiting-page";
      div.innerHTML = `
      <header class=header-container>
      <div class=nombres>
        <p>${this.myName}: ${this.myScore}</p>
        <p class="red">${this.nameOpponent}: ${this.scoreOpp}</<p>
      </div>
      <div class=sala>
        <p>Sala</p>
        <p>${this.roomId}</p>
      </div>
    </header>
      <custom-text variant="body">
        Esperando a que ${this.nameOpponent} presione ¡Jugar!...
      </custom-text>
      <div class="container">
        <custom-hand type="tijera"></custom-hand>
        <custom-hand type="piedra"></custom-hand>
        <custom-hand type="papel"></custom-hand>
      </div>
    `;
      style.innerHTML = `
      .waiting-page {
        padding: 20px 26px 0px 27px;
        margin: 0 auto;
        max-width: 322px;
        display: flex;
        flex-direction: column;
        gap: 139px;
      }
      .container{
        display:flex;
        justify-content: space-around;
        align-items: flex-end;
      }
      .text{
        font-size: 52px;
      }
      .header-container{
        height: 60px;
        display:flex;
        justify-content: space-between;
        align-items: center;
        font-size: 24px;
        font-family: 'Ubuntu', cursive;
        font-weight: 700;
      }
      .header-container p{
        margin:0;
      }
      .red{
        color: #FF6442;
      }
      .sala{
        text-align:right;
      }
      @media (min-width: 951px) {
        .waiting-page {
          gap: 120px;
          justify-content: flex-end;
        }
      }
        `;
      this.shadow.appendChild(div);
      this.shadow.appendChild(style);
      this.addListeners();
      window.onbeforeunload = function disconectPlayer() {
        state.setOnline(false);
      };
    }
  }
);
