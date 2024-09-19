import Express from "express";
import {
  signUp,
  login,
  getPlayer,
  signinWithProviders,
} from "../controllers/authentication_controller";

const authRouter = Express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", login);
authRouter.post("/signinWithProviders", signinWithProviders);
authRouter.get("/getPlayer/:_id", getPlayer);

export default authRouter;
