import { state } from "../../state";
import { Router } from "@vaadin/router";
customElements.define(
  "play-page",
  class extends HTMLElement {
    // shadow: ShadowRoot;
    constructor() {
      super();
      // this.shadow = this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      this.render();
      const handsEls: any = this.querySelectorAll("custom-hand");
      const counterEl = this.getElementsByTagName("custom-counter");
      const counter = counterEl[0];
      const div = this.querySelector(".play-page");
      for (const hand of handsEls) {
        hand.addEventListener("change", (e: any) => {
          const jugada = e.detail.jugada;
          hand.style.alignSelf = "center";
          state.setMove(jugada);
        });
      }
      this.contador(counter, div);
    }
    contador(c, div) {
      c.addEventListener("finish", (e: any) => {
        const cs = state.getState();
        const currentGame = cs.currentGame;
        const myPlay = currentGame.myPlay;
        const opponent = currentGame.opponent;
        const resultado = { myPlay, opponent };
        if (myPlay !== "none" && opponent !== "none") {
          state.pushToHistory({ ...resultado });
        }
        let final = e.detail.finish;
        if ((final && myPlay == "none") || opponent == "none") {
          Router.go("/instructions");
          state.setStart(false, () => {
            state.setChoice("none");
          });
        } else {
          const result = { myPlay, opponent };
          this.newPage(div, result);
          setTimeout(() => {
            Router.go("/result");
          }, 2000);
        }
      });
    }
    newPage(div, result) {
      const style = document.createElement("style");
      div.innerHTML = `
          <custom-hand class="rotar" type="${result.opponent}" size="XL"></custom-hand>
          <custom-hand type="${result.myPlay}" size="XL"> </custom-hand>
        `;
      style.innerHTML = `
        .play-page{
          justify-content: center;
          align-items: center;
          height: 100vh;
          gap: 130px;
          padding: 0px !important;
        }
        .rotar{
          transform: rotate(-180deg);
        }
        @media (min-width: 951px) {
          .play-page{
            gap: 350px !important;
          }
        `;
      div.appendChild(style);
      window.onbeforeunload = function disconectPlayer() {
        state.setOnline(false);
      };
    }
    render() {
      const style = document.createElement("style");
      this.innerHTML = `
      <div class=play-page>
        <custom-counter></custom-counter>
        <div class="container-hands">
          <custom-hand type="tijera" size="big"></custom-hand>
          <custom-hand type="piedra" size="big"></custom-hand>
          <custom-hand type="papel" size="big"></custom-hand>
        </div>
      </div>
      `;
      style.innerHTML = `
      .play-page {
        padding: 125px 5px 0 5px;
        margin: 0 auto;
        max-width: 375px;
        display: flex;
        flex-direction: column;
      }
      .container-hands{
          display:flex;
          justify-content: space-between;
          height: 310px;
          align-items: flex-end;
      }
      @media (min-width: 951px) {
        .play-page {
          gap: 150px;
          height: 100vh;
          justify-content: flex-center;
        }
    `;
      this.appendChild(style);
      window.onbeforeunload = function disconectPlayer() {
        state.setOnline(false);
        state.setStart(false);
      };
    }
  }
);
