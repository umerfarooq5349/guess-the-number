import Express from "express";
import cors from "cors";
import { errorHandlerMiddleware } from "./controllers/errors";
import authRouter from "./routes/auth";
import cookieParser from "cookie-parser";
const app = Express();

const corsOptions = {
  origin: process.env.CLIENT!, // Allow requests from this origin
  credentials: true, // Allow cookies to be sent
};

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use(cors(corsOptions));
app.use(Express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  // console.log(`cookies: ${req.cookies}`);
  next();
});

app.use("/api", authRouter);

app.use(errorHandlerMiddleware);

export default app;
