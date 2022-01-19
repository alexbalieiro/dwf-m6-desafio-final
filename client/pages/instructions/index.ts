import { Router } from "@vaadin/router";
import { state } from "../../state";
customElements.define(
  "instructions-page",
  class extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
    myName = "";
    nameOpponent = "";
    myScore = 0;
    scoreOpp = 0;
    roomId = "";
    startOpponent: boolean = false;
    addListeners() {
      const startButton: any = this.shadow.querySelector(".start-button");
      startButton.addEventListener("click", () => {
        state.setStart(true, () => {
          if (this.startOpponent === true) {
            Router.go("/play");
          } else {
            Router.go("/waiting");
          }
        });
      });
    }
    connectedCallback() {
      state.subscribe(() => {
        const cs = state.getState();
        this.roomId = cs.roomId;
        this.myName = cs.name;
        this.nameOpponent = cs.nameOpponent;
        this.startOpponent = cs.startOpponent;
        this.shadow.children[1].remove();
        this.render();
        this.shadow.children[1].remove();
      });
      const cs = state.getState();
      this.roomId = cs.roomId;
      this.myName = cs.name;
      this.nameOpponent = cs.nameOpponent;
      this.startOpponent = cs.startOpponent;
      const resultado = state.score();
      this.myScore = resultado.score.myPlay;
      this.scoreOpp = resultado.score.opponent;
      this.render();
    }
    render() {
      const div = document.createElement("dvi");
      const style = document.createElement("style");
      div.className = "instructions-page";
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
        Presioná jugar y elegí: piedra, papel o tijera antes de que pasen los 3 segundos.
      </custom-text>
      <custom-button class="start-button">¡Jugar!</custom-button>
      <div class="container">
        <custom-hand type="tijera"></custom-hand>
        <custom-hand type="piedra"></custom-hand>
        <custom-hand type="papel"></custom-hand>
      </div>
    `;
      style.innerHTML = `
      .instructions-page {
        padding: 20px 26px 0px 27px;
        margin: 0 auto;
        max-width: 322px;
        display: flex;
        flex-direction: column;
        gap: 23px;
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
        .instructions-page {
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
