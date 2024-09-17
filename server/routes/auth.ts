import Express from "express";
import {
  signUp,
  login,
  getPlayer,
} from "../controllers/authentication_controller";

const authRouter = Express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", login);
authRouter.get("/getPlayer/:_id", getPlayer);

export default authRouter;
