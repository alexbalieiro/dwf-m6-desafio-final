const piedra = require("url:../../img/piedra.png");
const papel = require("url:../../img/papel.png");
const tijera = require("url:../../img/tijera.png");
const piedraL = require("url:../../img/piedraBig.png");
const papelL = require("url:../../img/papelBig.png");
const tijeraL = require("url:../../img/tijeraBig.png");
const piedraXL = require("url:../../img/piedraXL.png");
const papelXL = require("url:../../img/papelXL.png");
const tijeraXL = require("url:../../img/tijeraXL.png");
customElements.define(
  "custom-hand",
  class extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      this.render();
    }
    render() {
      const img = document.createElement("img");
      const style = document.createElement("style");
      const type = this.getAttribute("type");
      const size = this.getAttribute("size");
      if (type == "tijera") {
        if (size == "big") {
          img.src = tijeraL;
        } else if (size == "XL") {
          img.src = tijeraXL;
        } else {
          img.src = tijera;
        }
      } else if (type == "piedra") {
        if (size == "big") {
          img.src = piedraL;
        } else if (size == "XL") {
          img.src = piedraXL;
        } else {
          img.src = piedra;
        }
      } else if (type == "papel") {
        if (size == "big") {
          img.src = papelL;
        } else if (size == "XL") {
          img.src = papelXL;
        } else {
          img.src = papel;
        }
      }
      style.innerHTML = `
      .flotar{
        display:flex;
      }
      `;
      img.className = type;
      this.shadow.appendChild(img);
      this.shadow.appendChild(style);
      this.addListeners();
    }
    addListeners() {
      const handEL = this.shadow;
      handEL.addEventListener("click", (e: any) => {
        const jugada = e.target.className;
        const event = new CustomEvent("change", {
          detail: {
            jugada: jugada,
          },
        });
        this.dispatchEvent(event);
      });
    }
  }
);
