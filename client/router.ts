import { Router } from "@vaadin/router";
import "./pages/welcome";
import "./pages/register";
import "./pages/getintoroom";
import "./pages/toshare";
import "./pages/instructions";
import "./pages/waiting";
import "./pages/play";
import "./pages/result";
import "./pages/fullroom";
const router = new Router(document.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "welcome-page" },
  { path: "/register", component: "register-page" },
  { path: "/getintoroom", component: "getintoroom-page" },
  { path: "/toshare", component: "toshare-page" },
  { path: "/instructions", component: "instructions-page" },
  { path: "/waiting", component: "waiting-page" },
  { path: "/play", component: "play-page" },
  { path: "/result", component: "result-page" },
  { path: "/fullroom", component: "fullroom-page" },
]);
