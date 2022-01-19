const API_BASE_URL = process.env.API_BASE_URL;
type Jugada = "piedra" | "papel" | "tijera" | "none";
type Game = {
  myPlay: Jugada;
  opponent: Jugada;
};
import { rtdb } from "./rtdb";
import map from "lodash/map";
const state = {
  data: {
    currentGame: {
      opponent: "",
      myPlay: "",
    },
    name: "",
    userId: "",
    roomId: "",
    rtdbId: "",
    online: false,
    start: false,
    nameOpponent: "",
    onlineOpponent: false,
    startOpponent: false,
    history: [],
  },
  listeners: [],
  init() {},
  listenRoom() {
    const cs = this.getState();
    const rtdbId = cs.rtdbId;
    const roomsFef = rtdb.ref("/rooms/" + rtdbId);
    roomsFef.on("value", (snapshot) => {
      const data = snapshot.val();
      const currentGame = map(data.currentGame);
      for (const cg of currentGame) {
        if (cg.name == cs.name) {
          const myPlay = cg.choice;
          cs.currentGame.myPlay = myPlay;
        } else {
          cs.nameOpponent = cg.name;
          cs.onlineOpponent = cg.online;
          cs.startOpponent = cg.start;
          cs.currentGame.opponent = cg.choice;
        }
      }
      this.setState(cs);
    });
  },
  getState() {
    return this.data;
  },
  setName(name: string) {
    const currentState = this.getState();
    currentState.name = name;
    this.setState(currentState);
  },
  signUp(callback) {
    const cs = this.getState();
    const name = cs.name;
    fetch(API_BASE_URL + "/signup", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: name,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        cs.userId = data.id;
        this.setState(cs);
        callback();
      });
  },
  askNewRoom(callback) {
    const cs = this.getState();
    const userId = cs.userId;
    const name = cs.name;
    fetch(API_BASE_URL + "/rooms", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        name: name,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        cs.roomId = data.id;
        this.setState(cs);
        callback();
      });
  },
  setRoomId(roomId) {
    const cs = this.getState();
    cs.roomId = roomId;
    this.setState(cs);
  },
  setIngreso(ingreso: string) {
    const cs = this.getState();
    cs.ingresoOpponent = ingreso;
    this.setState(cs);
  },
  getRtdbId(callback) {
    const cs = this.getState();
    const userId = cs.userId;
    const roomId = cs.roomId;
    fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + userId, {
      method: "get",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.message == "error") {
          callback(true);
        } else {
          cs.rtdbId = data.rtdbId;
          this.setState(cs);
          callback();
        }
      });
  },
  accessToRoom() {
    const cs = this.getState();
    const name = cs.name;
    const userId = cs.userId;
    const rtdbId = cs.rtdbId;
    if (userId && rtdbId) {
      fetch(API_BASE_URL + "/getinto/?rtdbId=" + rtdbId + "&userId=" + userId, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: name,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.online = data.online;
          this.setState(cs);
          this.listenRoom();
        });
    } else {
      console.error("faltan datos");
    }
  },
  setStart(start: boolean, callback?) {
    const cs = this.getState();
    cs.start = start;
    this.setState(cs);
    const userId = cs.userId;
    const rtdbId = cs.rtdbId;
    if (userId && rtdbId) {
      fetch(API_BASE_URL + "/start/?rtdbId=" + rtdbId + "&userId=" + userId, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          start,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then(() => {
          if (callback) callback();
        });
    } else {
      console.error("faltan datos");
    }
  },
  setOnline(online: boolean) {
    const cs = this.getState();
    cs.online = online;
    this.setState(cs);
    const userId = cs.userId;
    const rtdbId = cs.rtdbId;
    if (userId && rtdbId) {
      fetch(API_BASE_URL + "/online/?rtdbId=" + rtdbId + "&userId=" + userId, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          online,
        }),
      }).then((res) => {
        return res.json();
      });
    } else {
      console.error("faltan datos");
    }
  },
  setChoice(choice: string, callback?) {
    const cs = this.getState();
    const userId = cs.userId;
    const rtdbId = cs.rtdbId;
    if (userId && rtdbId) {
      fetch(API_BASE_URL + "/choice/?rtdbId=" + rtdbId + "&userId=" + userId, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          choice,
        }),
      }).then((res) => {
        return res.json();
      });
    } else {
      console.error("faltan datos");
    }
  },
  getCurrentGame() {
    const cs = this.getState();
    const rtdbId = cs.rtdbId;
    fetch(API_BASE_URL + "/currentGame/" + rtdbId, {
      method: "get",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        this.addHistory(data);
      });
  },
  addHistory() {
    const cs = this.getState();
    const roomId = cs.roomId;
    const name = cs.name;
    const nameOpponent = cs.nameOpponent;
    const newArray = [];
    const history = cs.history;
    for (const h of history) {
      const game = {
        [name]: h.myPlay,
        [nameOpponent]: h.opponent,
      };
      newArray.push(game);
    }

    fetch(API_BASE_URL + "/history/" + roomId, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        history: newArray,
      }),
    }).then((res) => {
      return res.json();
    });
  },
  getHistory(callback) {
    const cs = this.getState();
    const roomId = cs.roomId;
    const name = cs.name;
    const nameOpponent = cs.nameOpponent;
    fetch(API_BASE_URL + "/history/" + roomId, {
      method: "get",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        for (const h of data) {
          const game = {
            myPlay: h[name],
            opponent: h[nameOpponent],
          };
          this.data.history.push(game);
        }
        callback();
      });
  },
  whoWin(myPlay: string, opponent: string) {
    let resultado = "";
    if (myPlay == opponent) {
      resultado = "empate";
    } else if (myPlay == "piedra") {
      if (opponent == "tijera") {
        resultado = "ganaste";
      } else {
        resultado = "perdiste";
      }
    } else if (myPlay == "papel") {
      if (opponent == "piedra") {
        resultado = "ganaste";
      } else {
        resultado = "perdiste";
      }
    } else if (myPlay == "tijera") {
      if (opponent == "papel") {
        resultado = "ganaste";
      } else {
        resultado = "perdiste";
      }
    }
    return resultado;
  },
  score() {
    const history = this.getState().history;
    const respuesta = {
      score: {
        myPlay: 0,
        opponent: 0,
      },
    };
    for (const r of history) {
      const win = this.whoWin(r.myPlay, r.opponent);
      if (win == "ganaste") {
        respuesta.score.myPlay++;
      } else if (win == "perdiste") {
        respuesta.score.opponent++;
      }
    }
    return respuesta;
  },
  clearCurrentGame() {
    const cs = this.getState();
    cs.currentGame.myPlay = "none";
    this.setChoice(cs.currentGame.myPlay);
  },
  setMove(choice: Jugada) {
    const cs = this.getState();
    cs.currentGame.myPlay = choice;
    this.setState(cs);
    const userId = cs.userId;
    const rtdbId = cs.rtdbId;
    if (userId && rtdbId) {
      fetch(API_BASE_URL + "/choice/?rtdbId=" + rtdbId + "&userId=" + userId, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          choice,
        }),
      }).then((res) => {
        return res.json();
      });
    } else {
      console.error("faltan datos");
    }
  },
  pushToHistory(play: Game) {
    this.data.history.push(play);
  },
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    console.log("Soy el state, he cambiado", this.data);
  },
  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
};

export { state };
