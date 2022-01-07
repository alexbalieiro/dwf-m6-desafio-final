import * as express from "express";
import * as path from "path";
import { firestore, rtdb } from "./db";
import * as cors from "cors";
(function () {
  const port = process.env.PORT || 3000;
  const app = express();
  app.use(express.json());
  app.use(cors());

  console.log(process.env.FIREBASE_PROJECT_ID);

  const userCollection = firestore.collection("users");

  app.post("/signup", function (req, res) {
    const email = req.body.email;
    const nombre = req.body.nombre;
    userCollection
      .where("email", "==", email)
      .get()
      .then((searchResponse) => {
        if (searchResponse.empty) {
          userCollection
            .add({
              email: email,
              nombre,
            })
            .then((newUserRef) => {
              res.json({
                id: newUserRef.id,
                new: true,
              });
            });
        } else {
          res.status(400).json({
            message: "user already exists",
          });
        }
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
