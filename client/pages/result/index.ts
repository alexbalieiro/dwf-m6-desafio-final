import { state } from "../../state";
import { Router } from "@vaadin/router";
customElements.define(
  "result-page",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      state.setStart(false);
      state.addHistory();
      this.render();
      const button = this.querySelector(".button-return");
      button.addEventListener("click", () => {
        state.clearCurrentGame();
        Router.go("/instructions");
      });
    }
    getDate() {
      const cs = state.getState();
      const currentGame = cs.currentGame;
      const puntaje = state.score();
      const opponent = puntaje.score.opponent;
      const me = puntaje.score.myPlay;
      const win = state.whoWin(currentGame.myPlay, currentGame.opponent);
      return { opponent, me, win };
    }
    render() {
      const resultado = this.getDate();
      const cs = state.getState();
      const myName = cs.name;
      const nameOpponent = cs.nameOpponent;
      const style = document.createElement("style");
      this.innerHTML = `
      <div class="container">
      <custom-star class="star" type="${resultado.win}"></custom-star>
      <div class="score-container">
        <custom-text variant="body">Score</custom-text>
        <custom-text variant="right" style="text-align: right">${myName}: ${resultado.me}</custom-text>
        <custom-text variant="right" style="text-align: right">${nameOpponent}: ${resultado.opponent}</custom-text>
      </div>
      <custom-button class="button-return">Volver a Jugar</custom-button>
      <div>
      `;
      style.innerHTML = `
      body{
        background-color: ${
          resultado.win == "ganaste"
            ? "rgba(136, 137, 73, 0.9)"
            : "rgba(137, 73, 73, 0.9)"
        };
        background-image: none;
      }
      .container{
        display:flex;
        flex-direction: column;
        margin: 0 auto;
        max-width: 360px;
        padding-top: 25px;
        gap:20px;
      }
      @media (min-width: 951px) {
        .container{
          gap:50px;
          padding-top: 80px;
        }
      }
      .score-container{
        width: 259px;
        border: 10px solid #000000;
        border-radius: 10px;
        background-color: #FFFFFF;
        padding: 15px 30px;
        margin: 0 auto ;
      }
      .star{
        margin: 0 auto;
      }
    `;
      this.appendChild(style);
      window.onbeforeunload = function disconectPlayer() {
        state.setOnline(false);
      };
    }
  }
);
