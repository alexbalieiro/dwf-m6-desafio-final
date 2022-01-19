import { state } from "../../state";

customElements.define(
  "custom-header",
  class extends HTMLElement {
    constructor() {
      super();
    }
    myName = "";
    nameOpponent = "";
    roomId = "";
    myScore: 0;
    scoreOpp: 0;
    connectedCallback() {
      state.subscribe(() => {
        const cs = state.getState();
        this.myName = cs.name;
        this.nameOpponent = cs.nameOpponent;
        this.roomId = cs.roomId;
        this.render();
      });
      const cs = state.getState();
      this.myName = cs.name;
      this.nameOpponent = cs.nameOpponent;
      this.roomId = cs.roomId;
      this.render();
    }
    render() {
      const div = document.createElement("div");
      div.className = "container";
      const style = document.createElement("style");

      div.innerHTML = `
      <div class=nombres>
        <p>${this.myName}: ${this.myScore}</p>
        <p class="red">${this.nameOpponent}: ${this.scoreOpp}</<p>
      </div>
      <div class=sala>
        <p>Sala</p>
        <p>${this.roomId}</p>
      </div>
      `;
      style.innerHTML = `
      .container{
          height: 60px;
          display:flex;
          justify-content: space-between;
          align-items: center;
          font-size: 24px;
          font-family: 'Ubuntu', cursive;
          font-weight: 700;
        }
      .container p{
        margin:0;
      }
        .red{
          color: #FF6442;
        }
        .sala{
          text-align:right;
        }
        `;
      this.appendChild(div);
      this.appendChild(style);
    }
  }
);
