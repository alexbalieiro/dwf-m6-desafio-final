import * as express from "express";
(function () {
  const port = process.env.PORT || 3000;
  const app = express();
  app.use(express.json());

  app.get("/hola", (req, res) => {
    res.json({
      message: "hola soy el servidor",
    });
  });
  app.use(express.static("dist"));

  app.get("*", (req, res) => {
    res.sendFile(__dirname + "/dist/index.html");
  });
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
})();
