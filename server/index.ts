import * as express from "express";
import * as path from "path";
import { firestore, rtdb } from "./db";
import { nanoid } from "nanoid";
import * as cors from "cors";
import { error } from "console";
(function () {
  const port = process.env.PORT || 3000;
  const app = express();
  app.use(express.json());
  app.use(cors());
  const userCollection = firestore.collection("users");
  const roomCollection = firestore.collection("rooms");
  app.post("/signup", function (req, res) {
    const name = req.body.name;
    userCollection
      .where("name", "==", name)
      .get()
      .then((searchResponse) => {
        if (searchResponse.empty) {
          userCollection
            .add({
              name,
            })
            .then((newUserRef) => {
              res.json({
                id: newUserRef.id,
                new: true,
              });
            });
        } else {
          res.json({
            id: searchResponse.docs[0].id,
          });
        }
      });
  });
  app.post("/rooms", (req, res) => {
    const { userId } = req.body;
    const { name } = req.body;
    userCollection
      .doc(userId.toString())
      .get()
      .then((doc) => {
        if (doc.exists) {
          const roomRef = rtdb.ref("/rooms/" + nanoid());
          roomRef
            .set({
              currentGame: {
                [userId]: {
                  name,
                  online: true,
                  start: false,
                  choice: "none",
                },
              },
            })
            .then(() => {
              const roomLongId = roomRef.key;
              const roomId = Math.floor(Math.random() * 9999);
              roomCollection
                .doc(roomId.toString())
                .set({
                  rtdbId: roomLongId,
                  history: "",
                })
                .then(() => {
                  res.json({
                    id: roomId.toString(),
                  });
                });
            });
        } else {
          res.status(401).json({
            message: "no existe el room",
          });
        }
      });
  });
  app.get("/rooms/:roomId", (req, res) => {
    const { roomId } = req.params;
    const { userId } = req.query;
    roomCollection
      .doc(roomId)
      .get()
      .then((snap) => {
        if (snap.exists) {
          const data = snap.data();
          const roomRef = rtdb.ref("/rooms/" + data.rtdbId + "/currentGame/");
          roomRef.get().then((snap) => {
            const users = snap.val();
            if (Object.keys(users).length == 2 && !users[userId.toString()]) {
              res.status(401).json({ message: "error" });
            } else {
              res.json({ rtdbId: data.rtdbId });
            }
          });
        } else {
          res.status(401).json({
            message: "no existe esta sala",
          });
        }
      });
  });
  app.get("/history/:roomId", (req, res) => {
    const { roomId } = req.params;
    roomCollection
      .doc(roomId)
      .get()
      .then((snap) => {
        const data = snap.data();
        res.json(data.history);
      });
  });
  app.post("/getinto", (req, res) => {
    const { name } = req.body;
    const { userId } = req.query;
    const { rtdbId } = req.query;
    const roomRef = rtdb.ref("/rooms/" + rtdbId + "/currentGame/" + userId);
    roomRef
      .update({
        name,
        online: true,
        start: false,
        choice: "none",
      })
      .then(() => {
        roomRef.get().then((snap) => {
          const data = snap.val();
          const online = data.online;
          res.json({
            online,
          });
        });
      });
  });
  app.post("/history/:roomId", function (req, res) {
    const { roomId } = req.params;
    const { history } = req.body;
    roomCollection
      .doc(roomId)
      .update({
        history: history,
      })
      .then(() => {
        res.json("Se agregó history");
      });
  });
  app.post("/start/", function (req, res) {
    const { start } = req.body;
    const { userId } = req.query;
    const { rtdbId } = req.query;
    const roomRef = rtdb.ref("/rooms/" + rtdbId + "/currentGame/" + userId);
    roomRef
      .update({
        start,
      })
      .then(() => {
        res.json({
          message: "Se modificó Start",
        });
      });
  });
  app.post("/online", function (req, res) {
    const { online } = req.body;
    const { userId } = req.query;
    const { rtdbId } = req.query;
    const roomRef = rtdb.ref("/rooms/" + rtdbId + "/currentGame/" + userId);
    roomRef
      .update({
        online,
      })
      .then(() => {
        res.json({
          message: "Se modificó online",
        });
      });
  });
  app.post("/choice", function (req, res) {
    const { choice } = req.body;
    const { userId } = req.query;
    const { rtdbId } = req.query;
    const roomRef = rtdb.ref("/rooms/" + rtdbId + "/currentGame/" + userId);
    roomRef
      .update({
        choice,
      })
      .then(() => {
        res.json({
          message: "Se modificó choice",
        });
      });
  });

  app.use(express.static("dist"));

  app.get("*", (req, res) => {
    const rutaRelativa = path.resolve(__dirname, "../dist/", "index.html");
    res.sendFile(rutaRelativa);
  });
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
})();
