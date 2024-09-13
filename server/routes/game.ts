import Express from "express";
import { signUp, login } from "../controllers/authentication_controller";
import { addScore, updateHighScore } from "../controllers/game_controller";

const gameRouter = Express.Router();

gameRouter.get("/highestScore");
gameRouter.put("/score/:playerId", addScore);
gameRouter.put("/highScore/:playerId", updateHighScore);

export default gameRouter;
